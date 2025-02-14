import ContentSection from "@/components/ContentSection";
import GenericCard from "@/components/GenericCard"; 
import BoardAlumniCard from "@/components/BoardAlumniCard";
import UpcomingEventsCard from "@/components/UpcomingEventsCard";

const boardMembers = [
  { name: "Joe Bruin", position: "[insert position/year here]", quote: "“Quick blurb about what Creative Labs community means to them, what their favorite part is, etc. Something short, nice, and cute!” ", image: "/old/rectangle_pfp.png"},
  { name: "Joe Bruin", position: "[insert position/year here]", quote: "“Quick blurb about what Creative Labs community means to them, what their favorite part is, etc. Something short, nice, and cute!” ", image: "/old/rectangle_pfp.png" },
  { name: "Joe Bruin", position: "[insert position/year here]", quote: "“Quick blurb about what Creative Labs community means to them, what their favorite part is, etc. Something short, nice, and cute!” ", image: "/old/rectangle_pfp.png" }
];

const projectHighlights = [
  { name: "Joe Bruin", position: "[insert position/year here]", quote: "“Quick blurb about what Creative Labs community means to them, what their favorite part is, etc. Something short, nice, and cute!” ", image: "/old/rectangle_pfp.png"},
  { name: "Joe Bruin", position: "[insert position/year here]", quote: "“Quick blurb about what Creative Labs community means to them, what their favorite part is, etc. Something short, nice, and cute!” ", image: "/old/rectangle_pfp.png" },
  { name: "Joe Bruin", position: "[insert position/year here]", quote: "“Quick blurb about what Creative Labs community means to them, what their favorite part is, etc. Something short, nice, and cute!” ", image: "/old/rectangle_pfp.png" }
];

const alumniRecollections = [
  { name: "Alumni Bruin", position: "[insert position/year here]", quote: "“Quick blurb about their past experiences and memories from CL.” ", image: "/old/rectangle_pfp.png", contact: "Connect with [name] on LinkedIn or check out [name]'s portfolio! "},
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
      <div className="grow flex flex-col space-y-10 px-20 py-20 text-black min-w-full">
        <ContentSection title="WHAT IS CL?">
          <div className="flex flex-col space-y-8">
            <div className="mx-auto max-w-5xl"> 
              <img
                src="/old/about.jpg"
                alt="About Page Cover"
              />
            </div>
            <p className="text-lg">
            We’re a bunch of UCLA creatives passionate about making our world a little cooler! We offer various opportunities to students such as workshops and socials, which are available to everyone, and projects, which require an application process. A team of students will then work together to complete a project by the end of the quarter. Creative Labs started as a small group of friends and is founded on the idea that with the right group of people, any idea can come to life. Let’s make something cool together and spread some creativity!
            </p>
          </div>
        </ContentSection>

        <ContentSection title="BOARD MEMBER HIGHLIGHTS">
          <div className="flex flex-col space-y-8">
            <p className="text-lg">
            The internal board helps keep CL running behind the scenes! Let’s see what some board members have to say about their time with CL. Check out our current internal team HERE, or learn more about what our internal board does HERE!            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardMembers.map((member, idx) => (
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
        <ContentSection title="EXTERNAL PROJECTS HIGHLIGHTS">
          <div className="flex flex-col space-y-8">
            <p className="text-lg">
            Every quarter, students from all skillsets and backgrounds work together to execute any creative idea. Let’s see what some external projects members have to say about their time with CL. Learn more about external projects HERE!            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectHighlights.map((member, idx) => (
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
            We all started at Creative Labs, but our alumni have found success in both technical and non-technical fields! Let’s see what our alumni have to say about how CL helped them along in their journeys! 
            </p>
            <div className="flex flex-col items-center space-y-6">
              {alumniRecollections.map((alumni, idx) => (
                <BoardAlumniCard
                  key={idx}
                  name={alumni.name}
                  position={alumni.position}
                  quote={alumni.quote}
                  image={alumni.image}
                  contact={alumni.contact} // Includes "Connect with me on LinkedIn" text
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
