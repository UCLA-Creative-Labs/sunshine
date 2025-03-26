'use client';

import ContentSection from '@/components/ContentSection';
import GenericCard from '@/components/GenericCard';
import BoardAlumniCard from '@/components/BoardAlumniCard';
import UpcomingEventsCard from '@/components/UpcomingEventsCard';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getDocsByType } from '@/lib/contentfulLib/contentfulQuery';
import Link from 'next/link';

const cl_members = [
    {
        name: 'Coleman Leung',
        position: 'Co-President (2024-2025)',
        quote: "I've grown so much as both a leader and creative here. I love everyone in the CL fam!",
        image: '/about/coleman_leung.png',
    },
    {
        name: 'Bella Yu',
        position: 'Brallium Project Lead (Fall 2023)',
        quote: '"Thanks to CL, we\'re getting ready to launch our product in the coming months!"',
        image: '/about/bella_yu.png',
    },
    {
        name: 'Jordan Rivero',
        position: 'Leo Designer (Winter 2024)',
        quote: 'It felt amazing to use my knowledge for a project that I actually care about! Go team LEO!',
        image: '/about/jordan_rivero.png',
    },
    {
        name: 'Kate Ma',
        position: 'Projects Co-Director (2024-2025)',
        quote: 'Creative Labs is such a great way to connect and learn from other talented students... and make friends along the way!',
        image: '/about/kate_ma.png',
    },
];

const alumniRecollections = [
    {
        name: 'Sage Luong',
        position: 'Freelance Designer, Class of 2024',
        quote: 'As an aspiring UI/UX designer, learning to think creatively and empathetically to create better in-person and digital experiences for the CL community was a wonderful opportunity!',
        image: '/about/sage_luong.png',
    },
];

type Event = {
    fields: {
        title: string;
        description: string;
        eventTime: string | null; // null for past events
        location: string | null; // null for past events
        image?: {
            fields: {
                file: {
                    url: string;
                };
            };
        };
    };
};

export default function AboutContent() {
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [pastEvents, setPastEvents] = useState<Event[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const [upcoming, past] = await Promise.all([
                    getDocsByType('upcomingEvents'),
                    getDocsByType('pastEvents'),
                ]);
                setUpcomingEvents(upcoming as unknown as Event[]);
                setPastEvents(
                    (past as unknown as Event[]).map((event) => ({
                        ...event,
                        fields: {
                            ...event.fields,
                            eventTime: null,
                            location: null,
                        },
                    }))
                );
            } catch (error) {
                console.error('Error fetching events:', error);
                setError('Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="grow flex flex-col space-y-10 px-20 py-20 text-black min-w-full">
                <ContentSection title="WHAT IS CL?">
                    <div className="flex flex-col space-y-8">
                        <div className="mx-auto max-w-5xl relative">
                            <Image
                                src="/about/what-is-cl.jpg"
                                alt="About Page Cover"
                                width={1024}
                                height={576}
                                priority
                            />
                        </div>
                        <p className="text-lg">
                            We're a bunch of UCLA creatives passionate about
                            making our world a little cooler! We offer various
                            opportunities to students such as workshops and
                            socials, which are available to everyone, and
                            projects, which require an application process. A
                            team of students will then work together to complete
                            a project by the end of the quarter. Creative Labs
                            started as a small group of friends and is founded
                            on the idea that with the right group of people, any
                            idea can come to life. Let's make something cool
                            together and spread some creativity!
                        </p>
                    </div>
                </ContentSection>

                <ContentSection title="CL MEMBER HIGHLIGHTS">
                    <div className="flex flex-col space-y-8">
                        <p className="text-lg">
                            Our internal board and external projects work
                            together to make cool things! Let's see what some
                            members have to say about their time with CL, and
                            learn more about what Creative Labs does{' '}
                            <Link href="/projects">
                                <u>HERE</u>
                            </Link>
                            !
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {cl_members.map((member, idx) => (
                                <BoardAlumniCard
                                    key={idx}
                                    name={member.name}
                                    position={member.position}
                                    quote={member.quote}
                                    image={member.image}
                                />
                            ))}
                        </div>
                    </div>
                </ContentSection>

                <ContentSection title="ALUMNI STORIES">
                    <div className="flex flex-col space-y-8">
                        <p className="text-lg">
                            We all started at Creative Labs, but our alumni have
                            found success in both technical and non-technical
                            fields! Let's see what our alumni have to say about
                            how CL helped them along in their journeys!
                        </p>
                        <div className="flex flex-col items-center space-y-6">
                            {alumniRecollections.map((alumni, idx) => (
                                <BoardAlumniCard
                                    key={idx}
                                    name={alumni.name}
                                    position={alumni.position}
                                    quote={alumni.quote}
                                    image={alumni.image}
                                />
                            ))}
                        </div>
                    </div>
                </ContentSection>

                <ContentSection title="UPCOMING EVENTS">
                    <div className="flex flex-col space-y-4">
                        {upcomingEvents.map((event, idx) => (
                            <UpcomingEventsCard
                                key={idx}
                                title={event.fields.title}
                                description={event.fields.description}
                                eventTime={event.fields.eventTime || 'TBD'}
                                location={event.fields.location || 'TBD'}
                                imgSrc={
                                    event.fields.image?.fields?.file?.url
                                        ? `https:${event.fields.image.fields.file.url}`
                                        : '/default-event-image.jpg'
                                }
                                className="border-2 border-black rounded-2xl p-6"
                            />
                        ))}
                    </div>
                </ContentSection>

                <ContentSection title="PAST EVENTS">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pastEvents.map((event, idx) => (
                            <GenericCard
                                key={idx}
                                title={event.fields.title}
                                description={event.fields.description}
                                imgSrc={
                                    event.fields.image?.fields?.file?.url
                                        ? `https:${event.fields.image.fields.file.url}`
                                        : '/default-event-image.jpg'
                                }
                                className="border-2 border-black rounded-2xl p-6"
                            />
                        ))}
                    </div>
                </ContentSection>
            </div>
        </div>
    );
}
