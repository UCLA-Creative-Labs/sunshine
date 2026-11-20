begin;

-- Legacy usernames may have been entered manually, even on profiles with tokens.
-- Clear all legacy claims so every member proves ownership through OAuth again.
-- Apply during rollout with the matching callback code. Tokens remain private.
lock table public.profiles in share row exclusive mode;
update public.profiles set github_username = null where github_username is not null;

create unique index profiles_github_username_unique
    on public.profiles (lower(github_username))
    where github_username is not null;

create function public.protect_github_username()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if (TG_OP = 'INSERT' and NEW.github_username is not null)
       or (TG_OP = 'UPDATE' and NEW.github_username is distinct from OLD.github_username) then
        if coalesce(auth.role(), '') <> 'service_role' then
            raise exception 'GitHub accounts must be connected through OAuth'
                using errcode = '42501';
        end if;
    end if;
    return NEW;
end;
$$;

create trigger protect_github_username
    before insert or update on public.profiles
    for each row execute function public.protect_github_username();

-- Commit verified identity and tokens together. A duplicate identity or token
-- failure rolls back the entire connection, preserving any previous connection.
create function public.link_verified_github_account(
    p_user_id uuid,
    p_username text,
    p_access_token text,
    p_refresh_token text,
    p_access_expires_at timestamptz,
    p_refresh_expires_at timestamptz,
    p_scope text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
    if coalesce(auth.role(), '') <> 'service_role' then
        raise exception 'Service role required' using errcode = '42501';
    end if;
    if p_username is null or p_username !~ '^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}$' then
        raise exception 'Invalid GitHub username' using errcode = '22023';
    end if;

    update public.profiles set github_username = lower(p_username) where id = p_user_id;
    if not found then
        raise exception 'Profile not found' using errcode = 'P0002';
    end if;

    insert into public.github_user_tokens (
        user_id, access_token, refresh_token, access_expires_at,
        refresh_expires_at, scope, updated_at
    ) values (
        p_user_id, p_access_token, p_refresh_token, p_access_expires_at,
        p_refresh_expires_at, p_scope, now()
    )
    on conflict (user_id) do update set
        access_token = excluded.access_token,
        refresh_token = excluded.refresh_token,
        access_expires_at = excluded.access_expires_at,
        refresh_expires_at = excluded.refresh_expires_at,
        scope = excluded.scope,
        updated_at = excluded.updated_at;
end;
$$;

revoke all on function public.link_verified_github_account(uuid, text, text, text, timestamptz, timestamptz, text)
    from public, anon, authenticated;
grant execute on function public.link_verified_github_account(uuid, text, text, text, timestamptz, timestamptz, text)
    to service_role;

commit;
