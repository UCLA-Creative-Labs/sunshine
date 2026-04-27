import React, { useState, useRef, useEffect } from 'react';
import { Profile, Achievement } from './types';
import { Avatar, Badge, pickAvatarColor, type BadgeColor } from '@/components/portal/ui';
import { UCLA_MAJORS, getGradYearOptions } from '@/lib/constants/ucla';

interface ProfileSectionProps {
    profile: Profile;
    profileImage: string | null;
    bio: string;
    isEditingBio: boolean;
    achievements: Achievement[];
    roles?: any[];
    major: string;
    gradYear: string;
    onMajorChange: (v: string) => void;
    onGradYearChange: (v: string) => void;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBioChange: (value: string) => void;
    onEditBioStart: () => void;
    onEditBioEnd: () => void;
}

function roleContextToBadge(context: string): BadgeColor {
    if (context === 'internal') return 'pink';
    if (context === 'external') return 'blue';
    return 'ink';
}

function SelectChip({
    value,
    placeholder,
    color,
    options,
    onChange,
}: {
    value: string;
    placeholder: string;
    color: BadgeColor;
    options: string[];
    onChange: (v: string) => void;
}) {
    const [editing, setEditing] = useState(false);
    const selectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        if (editing && selectRef.current) {
            selectRef.current.focus();
            // Programmatically open the native dropdown on browsers that support it
            if (typeof (selectRef.current as any).showPicker === 'function') {
                try {
                    (selectRef.current as any).showPicker();
                } catch {
                    /* not supported — the focused select is still fine */
                }
            }
        }
    }, [editing]);

    if (editing) {
        return (
            <select
                ref={selectRef}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setEditing(false);
                }}
                onBlur={() => setEditing(false)}
                className="rounded-full border-[1.5px] border-cl-pink-700 bg-white px-2.5 py-1 font-ui text-xs font-bold text-ink-900 focus:outline-none focus:ring-4 focus:ring-cl-pink-100"
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setEditing(true)}
            className="group"
            aria-label={`Edit ${placeholder.toLowerCase()}`}
        >
            {value ? (
                <Badge
                    color={color}
                    className="transition-shadow group-hover:ring-2 group-hover:ring-ink-200"
                >
                    {value}
                </Badge>
            ) : (
                <span className="inline-flex items-center rounded-full border-[1.5px] border-dashed border-ink-300 px-2.5 py-1 font-code text-[10px] uppercase tracking-[0.06em] text-ink-400 transition-colors group-hover:border-ink-400 group-hover:text-ink-600">
                    + {placeholder}
                </span>
            )}
        </button>
    );
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
    profile,
    profileImage,
    bio,
    isEditingBio,
    achievements,
    roles = [],
    major,
    gradYear,
    onMajorChange,
    onGradYearChange,
    onImageChange,
    onBioChange,
    onEditBioStart,
    onEditBioEnd,
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const displayName =
        `${profile.first_name}${profile.last_name ? ` ${profile.last_name}` : ''}`.trim() || 'Unknown';
    const avatarColor = pickAvatarColor(displayName);
    const gradYearOptions = getGradYearOptions().map(String);

    return (
        <section className="rounded-2xl border border-ink-100 bg-white p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:gap-7">
                <div className="relative flex-shrink-0 self-start">
                    <div className="h-24 w-24 overflow-hidden rounded-2xl md:h-28 md:w-28">
                        {profileImage ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={profileImage}
                                alt={`${displayName} profile`}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Avatar
                                name={displayName}
                                color={avatarColor}
                                size="xl"
                                className="!h-full !w-full !rounded-2xl !text-[34px]"
                            />
                        )}
                    </div>
                    <label className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-white bg-ink-900/90 text-white shadow-sm transition-colors hover:bg-cl-blue-700">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onImageChange}
                            className="hidden"
                            aria-label="Change profile picture"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-3 w-3"
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                            />
                        </svg>
                    </label>
                </div>

                <div className="min-w-0 flex-1">
                    <span className="font-code text-[11px] uppercase tracking-[0.08em] text-ink-400">
                        @{profile.username} · joined {formatDate(profile.joined_date)}
                    </span>
                    <h1 className="mt-1 font-display text-[28px] font-bold leading-tight tracking-[-0.01em] text-ink-900 md:text-[36px]">
                        {displayName}
                    </h1>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <SelectChip
                            value={major}
                            placeholder="add major"
                            color="lime"
                            options={[...UCLA_MAJORS]}
                            onChange={onMajorChange}
                        />
                        <SelectChip
                            value={gradYear}
                            placeholder="add year"
                            color="mint"
                            options={gradYearOptions}
                            onChange={onGradYearChange}
                        />
                        {roles.map((role, index) => (
                            <Badge
                                key={index}
                                color={roleContextToBadge(role.context)}
                                className="capitalize"
                            >
                                {role.roles?.name ?? role.context}
                            </Badge>
                        ))}
                    </div>

                    <div className="mt-5 flex flex-col gap-2">
                        <span className="font-code text-[10px] uppercase tracking-[0.08em] text-ink-400">
                            bio
                        </span>
                        {isEditingBio ? (
                            <textarea
                                value={bio}
                                onChange={(e) => onBioChange(e.target.value)}
                                onBlur={onEditBioEnd}
                                placeholder="who are you when you're making things?"
                                className="w-full rounded-xl border-[1.5px] border-cl-pink-700 bg-white px-3.5 py-2.5 font-body text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-4 focus:ring-cl-pink-100"
                                rows={3}
                                autoFocus
                            />
                        ) : bio ? (
                            <button
                                type="button"
                                onClick={onEditBioStart}
                                className="rounded-xl border border-ink-100 bg-white px-3.5 py-2.5 text-left text-sm text-ink-900 transition-colors hover:border-ink-400"
                            >
                                {bio}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={onEditBioStart}
                                className="rounded-xl border-[1.5px] border-dashed border-ink-300 bg-transparent px-3.5 py-2.5 text-left font-accent italic text-[14px] text-ink-400 transition-colors hover:border-ink-400 hover:text-ink-600"
                            >
                                tell the club who you are
                            </button>
                        )}
                    </div>

                    {achievements.length > 0 && (
                        <div className="mt-5 flex flex-col gap-2">
                            <span className="font-code text-[10px] uppercase tracking-[0.08em] text-ink-400">
                                achievements
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                                {achievements.map((a) => (
                                    <span
                                        key={a.id}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-100 bg-ink-100 font-code text-[10px] uppercase tracking-[0.06em] text-ink-900"
                                        title={a.type}
                                    >
                                        {a.type.slice(0, 1)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProfileSection;
