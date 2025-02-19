import ContentSection from "@/components/ContentSection";
import GenericCard from "@/components/GenericCard"; 
import BoardAlumniCard from "@/components/BoardAlumniCard";
import UpcomingEventsCard from "@/components/UpcomingEventsCard";

const cl_members = [
  { name: "Coleman Leung", position: "Co-President (2024-2025)", quote: "I’ve grown so much as both a leader and creative here. I love everyone in the CL fam!", image: "/about/coleman_leung.png"},
  { name: "Bella Yu", position: "Brallium Project Lead (Fall 2023)", quote: "“Thanks to CL, we’re getting ready to launch our product in the coming months!”", image: "/about/bella_yu.png" },
  { name: "Jordan Rivero", position: "Leo Designer (Winter 2024)", quote: "It felt amazing to use my knowledge for a project that I actually care about! Go team LEO!", image: "/about/jordan_rivero.png" },
  { name: "Kate Ma", position: "Projects Co-Director (2024-2025)",quote: "Creative Labs is such a great way to connect and learn from other talented students... and make friends along the way!", image: "/about/kate_ma.png" }
];

const alumniRecollections = [
  { name: "Sage Luong", position: "Freelance Designer, Class of 2024", quote: "As an aspiring UI/UX designer, learning to think creatively and empathetically to create better in-person and digital experiences for the CL community was a wonderful opportunity!", image: "/about/sage_luong.png"},
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
                src="/about/what-is-cl.jpg"
                alt="About Page Cover"
              />
            </div>
            <p className="text-lg">
            We’re a bunch of UCLA creatives passionate about making our world a little cooler! We offer various opportunities to students such as workshops and socials, which are available to everyone, and projects, which require an application process. A team of students will then work together to complete a project by the end of the quarter. Creative Labs started as a small group of friends and is founded on the idea that with the right group of people, any idea can come to life. Let’s make something cool together and spread some creativity!
            </p>
          </div>
        </ContentSection>

        <ContentSection title="CL MEMBER HIGHLIGHTS">
          <div className="flex flex-col space-y-8">
            <p className="text-lg">
            Our internal board and external projects work together to make cool things! Let’s see what some members have to say about their time with CL, and learn more about what Creative Labs does <a href="/projects"><u>HERE</u></a>!</p>
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
                />
          
              ))}
            </div>
          </div>
        </ContentSection>

        

        {/* <ContentSection title="UPCOMING EVENTS">
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
        </ContentSection> */}

      </div>
    </div>
  );
}
