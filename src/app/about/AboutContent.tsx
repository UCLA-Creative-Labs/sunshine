import ContentSection from "@/components/ContentSection";
import GenericCard from "@/components/GenericCard"; 
import BoardAlumniCard from "@/components/BoardAlumniCard";
import UpcomingEventsCard from "@/components/UpcomingEventsCard";

const boardMembers = [
  { quote: "“Quick blurb about what Creative Labs community means to them, what their favorite part is, etc. Something short, nice, and cute!” - Joe Bruin", image: "/old/rectangle_pfp.png"},
  { quote: "“Quick blurb about what Creative Labs community means to them, what their favorite part is, etc. Something short, nice, and cute!” - Joe Bruin", image: "/old/rectangle_pfp.png" }
];

const alumniRecollections = [
  { quote: "“Quick blurb about their past experiences and memories from CL.” - Joe Bruin", image: "/old/rectangle_pfp.png" },
  { quote: "“Quick blurb about their past experiences and memories from CL.” - Joe Bruin", image: "/old/rectangle_pfp.png" },
  { quote: "“Quick blurb about their past experiences and memories from CL.” - Joe Bruin", image: "/old/rectangle_pfp.png" }
];

const upcomingEvents = [
  { title: "Fall 2022 Demo Day", time: "Thursday, December 1 @ 6pm", location: "Haines A18", imgSrc: "/old/f22_demo.png", description: "🍊DEMO DAY IS COMING🍊 come check out fall quarter’s demo day THIS THURSDAY!! @ 6PM in Haines A18!! hear about all the cool😎and creative😋projects and get inspired💡be there🫵or be square❎"},
  { title: "Bracelet Social", time: "Friday, October 21 @ 3pm", location: "Tongva Steps", imgSrc: "/old/f22_social.png", description: "Come make a bracelet, keychain, or phone charm at 🆑’s bracelet-making 🧵 social this Friday (10/21)! We’ll be at the Tongva Steps from 3PM - 5PM🪷 See you there! 🐸 Due to limited supplies, RSVP at tinycl.com/bracelet-social to guarantee your spot 🫶"},
  { title: "Spotify API Workshop", time: "Tuesday, October 18 @ 6pm", location: "Dodd 170", imgSrc: "/old/f22_workshop.png", description: "To start off our year we wanted to welcome everyone to our first workshop! Led by the Tech team, learn how to access your top fifty songs 🎶using the Spotify API Tuesday (10/18) at 6pm at Dodd 170! RSVP at tinycl.com/spotify-workshop."}
];

const pastEvents = [
  { title: "Spring 2022 Demo Day", imgSrc: "/old/s22_demo.png", description: "Demo Day is coming up this Friday, June 3rd from 6-8 PM @ Kinsey 1200B. Our project leads and members are super excited for you to see their projects this quarter!"},
  { title: "Sharetea Social", imgSrc: "/old/s22_social.png", description: "Need a pick-me-up??Get 🧋boba🧋 with us today!See you at De Neve turnaround at 7️ or meet us at Sharetea at 7:20pm‼️"},
  { title: "Spring 2022 First General Meeting", imgSrc: "/old/s22_gm.png", description: "Want to take part in some awesome 🌟projects? Meet cool 😎 people? Gain technical 👾 and non-technical 📝experience? Come to CL’s 🌸Spring General Meeting🌸... "}
];

export default function AboutContent() {
  return (
    <div>
      <div className="mx-auto max-w-5xl"> 
        <img
          src="/old/about.jpg"
          alt="About Page Cover"
        />
      </div>
      <div className="grow flex flex-col space-y-10 px-20 py-20 text-black min-w-full">
        <ContentSection title="ABOUT">
          <p className="text-lg">
            We connect students from all disciplines and backgrounds together to bring any creative passion project to life! We offer various opportunities to students such as workshops and socials, which are available to everyone, and projects, which require an application process. A team of students will then work together to complete a project by the end of the quarter. Creative Labs started as a small group of friends and is founded on the idea that with the right group of people, any idea can come to life. Let’s make something cool together!
          </p>
        </ContentSection>

        <ContentSection title="BOARD MEMBER HIGHLIGHTS">
          <div className="flex flex-wrap justify-between">
            {boardMembers.map((member, idx) => (
              <div key={idx} className="w-1/2 p-4">
              <BoardAlumniCard
                quote={member.quote}
                image={member.image}
              />
            </div>            
            ))}
          </div>
        </ContentSection>

        <ContentSection title="ALUMNI RECOLLECTIONS">
          <div className="flex flex-wrap justify-between">
            {alumniRecollections.map((alumni, idx) => (
              <div key={idx} className="w-1/3 p-4">
              <BoardAlumniCard
                quote={alumni.quote}
                image={alumni.image}
              />
            </div>            
            ))}
          </div>
        </ContentSection>

        <ContentSection title="UPCOMING EVENTS">
          <div className="flex flex-col space-y-4">
            {upcomingEvents.map((event, idx) => (
              <UpcomingEventsCard
                key={idx}
                title={event.title}
                description={event.description}
                eventTime={event.time}
                location={event.location}
                imgSrc={event.imgSrc}
                className="border border-gray-300 rounded-md"
              />
            ))}
          </div>
        </ContentSection>

        {/* <ContentSection title="UPCOMING EVENTS">
          <div className="flex flex-col space-y-2 border border-gray-300 p-3 rounded-md">
            {upcomingEvents.map((event, idx) => (
              <GenericCard
                key={idx}
                title={event.title}
                description={`${event.description}\n${event.time}\n${event.location}`}
                imgPos="left"
                imgSrc={event.imgSrc} 
                className="border border-black-300 rounded-md p-3"
              />
            ))}
          </div>
        </ContentSection> */}

        <ContentSection title="PAST EVENTS">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event, idx) => (
              <GenericCard
                key={idx}
                title={event.title}
                description={event.description}
                imgSrc={event.imgSrc} 
                className="border border-black-300 rounded-md p-4"
              />
            ))}
          </div>
        </ContentSection>
      </div>
    </div>
  );
}
