import IndividualProjectCard, { IndividualProjectProps } from "./IndividualProjectCard";

interface QuarterListProps {
    quarter: string;
    year: string;
};

const allProjects = {
    "22-23": {
        fall: [
            {
                projectName: "BHive",
                projectLeads: ["Reily Fairchild"],
                projectDescription: "UCLA is amazing for its diversity in passionate students. But that also means there are so many separate faculties, and creating a cohesive campus community is no easy task. Every Bruin deserves to have the perfect peer mentor to help them navigate this new stage of life, and the perfect match is certainly out there. The only obstacle? Getting connected.Introducing BruinHive: a cross-departmental, peer-mentoring network platform designed for all Bruins to find another bee that shares their buzz in our academic, social hive. Our website is here to help foster a well-connected, resilient, and informed student body.",
                projectManagers: ["--"],
                projectMembers: ["Daniel Bai", "Rachita Rajesh", "Nicholas Lingad", "Lindsay Harrison", "Kimberley Nguyen", "Nikita Patra", "Ishan Garg"],
                demoDayUrl: "https://docs.google.com/presentation/d/1adUbsKuLwXc9Hix9mKUxOs8cVGYidjixhAj530STNRA/edit#slide=id.g2631ab416d2_10_1904",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "PlanIt",
                projectLeads: ["Esther Tian", "Laura Lu"],
                projectDescription: "PlanIt is a web app designed to solve the difficulties behind travel planning and streamline the process of building out a cohesive itinerary",
                projectManagers: ["--"],
                projectMembers: ["Sohyun Ko", "Cassidy Tu", "Kaitlyn Li", "Sedge Greenlee", "Claire Xu", "Edward Ng", "Erin Kwon", "Pradyumn Acharya", "Michael Yuan", "Kalyan Karamsetty", "Kenny Wan"],
                demoDayUrl: "https://docs.google.com/presentation/d/1b7h2WRQiFKl1-4PlpKsGwk2FnT7H72TSV2iPYv3YYKE/edit#slide=id.g1a08f41bd8d_0_1449",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "NOMS",
                projectLeads: ["Cami Chou"],
                projectDescription: "Noms is a platform focused on eliminating food waste and providing more affordable, high-quality food options for food-insecure Bruins. Noms aims to work in conjunction with UCLA Dining, ASUCLA, and possibly restaurants in Westwood as well to sell food that would have been thrown away at a discounted price, earning revenue that would have been lost.",
                projectManagers: ["--"],
                projectMembers: ["Deborah Lee", "Hema Somaya", "Henry Wang", "Jason Tay", "Jonah Kim", "Jonathan Keung", "Justin Sheu", "Katherine Wang", "Natasha Cheung", "Ollie Pai", "Sanjit Sarda", "Shovanne Juang", "Sonav Agarwal"],
                demoDayUrl: "https://docs.google.com/presentation/d/1b7h2WRQiFKl1-4PlpKsGwk2FnT7H72TSV2iPYv3YYKE/edit#slide=id.g19b4f7d11a3_0_5",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            }
        ],
        winter: [
            {
                projectName: "FanSpace",
                projectLeads: ["Cathy Charles", "Vanshita Gupta"],
                projectDescription: "Have you ever missed out on a concert/music festival just because you had nobody to go with you? Have you ever spent more money on Uber fees than the cost of the concert ticket itself? Have you ever wondered what other students like the same artists as you? Our mobile application aims to help students connect with other students with similar interests and music taste and allows them to coordinate their concert experiences with others.",
                projectManagers: ["--"],
                projectMembers: ["Kim Nguyen", "Alia Koe", "Tiffany Zheng", "Izak Bunda", "Aryan Singh", "Walter Chen", "Florence Zhao", "Justin Sun"],
                demoDayUrl: "https://docs.google.com/presentation/d/1vO5T84kvOwFUbpvOQVUd-K9kZ2mfpBxkgoMur631NLc/edit#slide=id.g21e845c926a_0_24",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "Mapify",
                projectLeads: ["Kalyan Karamsetty", "Kaylee Mei Chao"],
                projectDescription: "Mapify is a mobile application that blends your location with your music taste bringing geographic control of your music to your fingertips. ",
                projectManagers: ["--"],
                projectMembers: ["Joyce Chen", "Robin Zhao", "Nicholas Wang", "Jayson Tian", "Chloe Ji", "Nitya Khanna", "Madeline Mai", "Max Gonick", "Edward Ng", "Georgia Trentalange", "Claire Zhang"],
                demoDayUrl: "https://docs.google.com/presentation/d/1vO5T84kvOwFUbpvOQVUd-K9kZ2mfpBxkgoMur631NLc/edit#slide=id.g21e845c926a_0_18",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            }
        ],
        spring: [
            {
                projectName: "FanSpace",
                projectLeads: ["Cathy Charles", "Vanshita Gupta"],
                projectDescription: "Have you ever missed out on a concert/music festival just because you had nobody to go with you? Have you ever spent more money on Uber fees than the cost of the concert ticket itself? Have you ever wondered what other students like the same artists as you? Our mobile application aims to help students connect with other students with similar interests and music taste and allows them to coordinate their concert experiences with others.",
                projectManagers: ["--"],
                projectMembers: ["Angela Marie Guevarra", "Aryan Janolkar", "Florence Zhao", "Justin Sun", "Kim Nguyen", "Lawrence Lee", "Tiffany Zheng", "Yajing Feng", "Vikram Puliyadi", "Ying Chou", "Auorra Uban"],
                demoDayUrl: "https://docs.google.com/presentation/d/1XqBU-Zeapg8Vn7cMeUi-aeDvxgHZdCbxIizKqlWwuts/edit#slide=id.g25061469c27_1_1127",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "Quizl",
                projectLeads: ["Hardik Jain", "Nitya Khanna"],
                projectDescription: "We created Quizl to help with these problems by providing a way for you to monitor and limit your “distracting” app usage while studying, as well as, offering you a way to strengthen your knowledge through personalized quizzes based on your current UCLA courses.",
                projectManagers: ["--"],
                projectMembers: ["Nitya Khanna", "Hardik Jain", "Kylie Bach", "Madhav Menon", "Ellen Lee", "Harshith Senthilkumaran", "Brian Ton", "Ashvin Logashankar", "Peiyuan Lee"],
                demoDayUrl: "https://docs.google.com/presentation/d/1XqBU-Zeapg8Vn7cMeUi-aeDvxgHZdCbxIizKqlWwuts/edit#slide=id.g250aa77ac17_2_1427",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "Pocket Studio",
                projectLeads: ["Kate Ma"],
                projectDescription: "We created Quizl to help with these problems by providing a way for you to monitor and limit your “distracting” app usage while studying, as well as, offering you a way to strengthen your knowledge through personalized quizzes based on your current UCLA courses.",
                projectManagers: ["--"],
                projectMembers: ["Jocelyn Mendoza", "Joyce Pang", "Jennie Gao", "Ronald Lu", "Coleman Leung", "Dylan Wan", "Ashley Flores", "Shivum Kapoor", "Daniel Chang", "Kelly Yu"],
                demoDayUrl: "https://docs.google.com/presentation/d/1XqBU-Zeapg8Vn7cMeUi-aeDvxgHZdCbxIizKqlWwuts/edit#slide=id.g250addb0117_1_574",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "Intention",
                projectLeads: ["Tony Jiang", "Sam Chan", "Anan Wang"],
                projectDescription: "Intention sets strict and customizable time limits for desired apps and app groups.",
                projectManagers: ["--"],
                projectMembers: ["Sophia Lee", "Cheryl Lim", "Darlina Williams", "Nikhil Isukapalli", "Rachel Shim", "Glenda Huang", "Andrea Wu"],
                demoDayUrl: "https://docs.google.com/presentation/d/1XqBU-Zeapg8Vn7cMeUi-aeDvxgHZdCbxIizKqlWwuts/edit#slide=id.g250addb0117_25_1173",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            }
        ]
    },
    "23-24": {
        fall: [
            {
                projectName: "Brallium",
                projectLeads: ["Bella Yu"],
                projectDescription: "At Brallium, we are dedicated to create the most inclusive, sustainable, and reusable nipple covers ever! 🌍 Our product caters to everyone 🧒👦👩🧑👨👵🧓👴 looking for secure breast protection free of harmful adhesives. Come find out how the most environmental-friendly nipple covers been designed at demo day! 🧪Explore our incredible e-commerce platform featuring an  innovative integrated bra-size calculator 🧮 and embark on your own nipple cover journey with a caring community of people that share your values and identity🫶",
                projectManagers: ["Kate Ma"],
                projectMembers: ["Clara Kang", "Alexa Anderson", "Julie Quan", "Michelle Sun", "Janie Kuang", "Zen Xia", "Emily Lu", "Maleeha Zaman", "Sahithi Lingampalli", "Christina Wu"],
                demoDayUrl: "https://docs.google.com/presentation/d/1adUbsKuLwXc9Hix9mKUxOs8cVGYidjixhAj530STNRA/edit#slide=id.g2631ab416d2_10_1904",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "FitTogether",
                projectLeads: ["Pranav Sankar"],
                projectDescription: "🌟Transform your fitness journey with FitTogether! 🏃‍♀️🏋️‍♂️ We're more than just an AI-powered app - we're a community dedicated to making fitness fun and inclusive. Whether you're into marathons, yoga, or quick gym sessions, find your ideal workout partner and join group challenges. 🤸‍♀️🏆 Share tips, celebrate progress, and be part of a healthier, more connected society. It's time to fit in fitness, together! 💖🌍",
                projectManagers: ["Rohan Gandhi", "Aahil Ali"],
                projectMembers: ["Sharon Chen", "Alex Zheng", "Rohan Sinha", "Sunny Vinay", "Pranav Subbaraman", "Saatvik Sharma", "Theanh Nguyen"],
                demoDayUrl: "https://docs.google.com/presentation/d/1adUbsKuLwXc9Hix9mKUxOs8cVGYidjixhAj530STNRA/edit#slide=id.g2631ab416d2_12_1709",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "Clearify",
                projectLeads: ["Raina Wan", "Tiana Ly"],
                projectDescription: "Clearify is a browser extension to accompany your skincare and makeup online shopping experience. 💻 🌟 With Clearify, you can research on-the-go as you browse for your next  must-have. Fill in the ingredients list (or use our autofill feature),  and we’ll analyze your product’s concerns, benefits, and compatibility with your skin type. 🔎 From checking if your product is safe for oily skin to highlighting the overall impact of the ingredients, Clearify helps you to buy products that perfectly align with your skincare needs. As a team of skincare junkies, we’re so excited to bring you this project and try it out for ourselves! Add Clearify to your browser by downloading on the Chrome Web Store. 💆🏻‍♀️",
                projectManagers: ["Marie Godderis", "Nivetha Balu"],
                projectMembers: ["Nitya Khanna", "Meg Yuan", "Stephanie Mae Mauricio", "Ashish Basetty", "William Wong", "Lucian Lu"],
                demoDayUrl: "https://docs.google.com/presentation/d/1adUbsKuLwXc9Hix9mKUxOs8cVGYidjixhAj530STNRA/edit#slide=id.g2631ab416d2_3_12226",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            }
        ],
        winter: [
            {
                projectName: "LEO",
                projectLeads: ["Rathul Anand"],
                projectDescription: "Leo provides personalized, data-driven workout routines and insightful analytics to promote growth",
                projectManagers: ["Nivetha Balu"],
                projectMembers: ["Shreya Annamaneni", "Jordan Rivero", "Amy Zhang", "Rohan Sinha", "Connor Steigerwald", "Tony Chen", "Theanh Nguyen", "Savio Joseph", "Ananya Anand", "Pravir Chugh"],
                demoDayUrl: "https://docs.google.com/presentation/d/1Illa3g8HZY4nVXoyKOoL8jbVSNrdkPBuxYanUCYbw2o/edit#slide=id.g26b96b9917e_1_720",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "Cohabit",
                projectLeads: ["Joana Fang", "Kenny Wan"],
                projectDescription: "Cohabit makes habit-building fun. Form groups with your friends and build habits together. Encourage them to stick to their habits. They'll encourage you to stick to yours.",
                projectManagers: ["Kate Ma"],
                projectMembers: ["Stephanie Ton", "Tiffany Zheng", "Joanna Bui", "Diana Tran", "Patrick Li", "Lam Luong", "Eideen Mozaffari", "Tom Oh", "Ryan Vu", "May Zheng"],
                demoDayUrl: "https://docs.google.com/presentation/d/1Illa3g8HZY4nVXoyKOoL8jbVSNrdkPBuxYanUCYbw2o/edit#slide=id.g26b96b9917e_6_290",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "Clearify",
                projectLeads: ["Raina Wan", "Tiana Ly"],
                projectDescription: "Clearify is a browser extension to accompany your skincare and makeup online shopping experience. 💻 🌟 With Clearify, you can research on-the-go as you browse for your next  must-have. Fill in the ingredients list (or use our autofill feature),  and we’ll analyze your product’s concerns, benefits, and compatibility with your skin type. 🔎 From checking if your product is safe for oily skin to highlighting the overall impact of the ingredients, Clearify helps you to buy products that perfectly align with your skincare needs. As a team of skincare junkies, we’re so excited to bring you this project and try it out for ourselves! Add Clearify to your browser by downloading on the Chrome Web Store. 💆🏻‍♀️",
                projectManagers: ["Marie Godderis", "Sidharth Sudhir"],
                projectMembers: ["Nitya Khanna", "Meg Yuan", "Stephanie Mae Mauricio", "Ashish Basetty", "William Wong", "Lucian Lu"],
                demoDayUrl: "https://docs.google.com/presentation/d/1Illa3g8HZY4nVXoyKOoL8jbVSNrdkPBuxYanUCYbw2o/edit#slide=id.g26b96b9917e_1_5066",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "Cooking 101",
                projectLeads: ["Joyce Pang"],
                projectDescription: "Say bye-bye to your struggle meal era and hello to chef era!!! Whether you’re learning to cook for yourself or wanting to share your very own recipes, Cooking 101 will have everything ready for you to chef it up!  Find recipes from different cuisines and lifestyles to test out and never suffer a hungry night ever again :)",
                projectManagers: ["--"],
                projectMembers: ["Ryan Vu", "Benjamin Xie", "Brian Zhao", "Leroy Gage", "Alex Zheng", "Jenny Zhuang", "Nimisha Seshadri", "Stella Kang"],
                demoDayUrl: "https://docs.google.com/presentation/d/1Illa3g8HZY4nVXoyKOoL8jbVSNrdkPBuxYanUCYbw2o/edit#slide=id.g26b96b9917e_3_662",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "Local Find",
                projectLeads: ["Noey Chinvittayakul"],
                projectDescription: "Discover hidden gems and savor the flavor of the streets with Local Find! 🔎🍔  Join a passionate group of food lovers dedicated to celebrating and supporting street food and local vendors. Share your discoveries and get personalized recommendations to feast like a local.",
                projectManagers: ["Rohan Gandhi"],
                projectMembers: ["Sophia Nguyen", "Ina Chang", "Kasie Yang", "Christine Han", "Tingyu Gong", "Inman Costa", "Aparna Hariharan", "Naomi Gong", "David Sai"],
                demoDayUrl: "https://docs.google.com/presentation/d/1Illa3g8HZY4nVXoyKOoL8jbVSNrdkPBuxYanUCYbw2o/edit#slide=id.g26b96b9917e_9_0",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            }
        ],
        spring: [
            {
                projectName: "Cohabit",
                projectLeads: ["Joana Fang", "Kenny Wan"],
                projectDescription: "Cohabit makes habit-building fun. Form groups with your friends and build habits together. Encourage them to stick to their habits. They'll encourage you to stick to yours.",
                projectManagers: ["Kate Ma"],
                projectMembers: ["Stephanie Ton", "Tiffany Zheng", "Joanna Bui", "Diana Tran", "Patrick Li", "Tom Oh", "Divik Chotani", "May Zheng", "Priyal Sharma", "Yang Gao", "Philena Nguyen"],
                demoDayUrl: "https://docs.google.com/presentation/d/1fJmEAd5SkQ1NsTsazwXZbPaXjsNCF8HAsO20HgdtHiA/edit#slide=id.BFGCMw9v",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "candiid",
                projectLeads: ["Andy Ren", "Franklin Zhu"],
                projectDescription: "Candiid is a social media app designed to transform how friends plan and share their adventures. By eliminating the clutter of unused group chats and forgotten shared albums, Candiid offers a streamlined and creative experience for organizing hangouts and capturing meaningful moments. The app’s unique memory board feature allows users to craft personalized collages, growing with vivid memories as more adventures are shared.",
                projectManagers: ["Aparna Hariharan"],
                projectMembers: ["Yeon Joo Nam", "Cory Poon", "Erin Choi", "Maggie Ju", "Alwena Lin", "Katie Chung", "Alex Yoon", "Erin Wu", "Jeff Yue"],
                demoDayUrl: "https://docs.google.com/presentation/d/1fJmEAd5SkQ1NsTsazwXZbPaXjsNCF8HAsO20HgdtHiA/edit#slide=id.g2e320de9882_1_720",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "FocusView",
                projectLeads: ["Ashish Basetty"],
                projectDescription: "FocusView is an app to help you study better. We addressed problems many students face, including aching back from horrible posture, constant phone distraction, distracting study environments and other bad habits, with computer vision.",
                projectManagers: ["Nivetha Balu"],
                projectMembers: ["Arjun Nair", "Disha Sikaria", "Anoushka Bhat", "Sanjana Rathore", "Adarsh Chilkunda", "Naomi Gong", "Samagra Pandey", "Shloak Rathod", "Helen Feng", "Christine Han", "Claire Kim", "Nhan Nguyen", "Hema Somaya"],
                demoDayUrl: "https://docs.google.com/presentation/d/1fJmEAd5SkQ1NsTsazwXZbPaXjsNCF8HAsO20HgdtHiA/edit#slide=id.7yAHBV8w",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "Clothesline",
                projectLeads: ["Meagan Clarke", "Zane LaBute"],
                projectDescription: "Clothesline is all about providing users with the clothes they need, when they need it. Through the search feature, users can easily find the pieces they are looking for.",
                projectManagers: ["Rohan Gandhi"],
                projectMembers: ["Jenny Zhuang", "Emily Poon", "Amanda Chan", "Ariya Ghoshal", "Travis Nguyen", "Rhea Jain", "Andrew Wang"],
                demoDayUrl: "https://docs.google.com/presentation/d/1fJmEAd5SkQ1NsTsazwXZbPaXjsNCF8HAsO20HgdtHiA/edit#slide=id.g2e320de9882_0_0",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            }
        ]
    },
    "24-25": {
        fall: [
            {
                projectName: "Clothesline",
                projectLeads: ["Meagan Clarke", "Zane LaBute"],
                projectDescription: "Clothesline is all about providing users with the clothes they need, when they need it. Through the search feature, users can easily find the pieces they are looking for.",
                projectManagers: ["Sophia Nguyen"],
                projectMembers: [ "Emily Poon", "Ariya Ghoshal", "Justine Constantino", "Andrew Wang", "Helen Feng", "Ben Liang", "Rhea Jain", "David Su", "Anusha Ladha", "Ria Rao", "Emily Duan", "Christina Isac"],
                demoDayUrl: "https://docs.google.com/presentation/d/1R8b3j6r-cqUQ8bFLHnB0_1YX9wHqgCVo9yv-A3DimEc/edit#slide=id.g31c1bf06f7f_0_1149",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "Swipe Smart",
                projectLeads: ["Will Wong"],
                projectDescription: "Swipe Smart is an app to help you stay organized and save money efficiently by tracking your credit card savings, making it easier to manage multiple cards and find out which ones offer the best rewards.",
                projectManagers: ["Sahithi Lingampalli"],
                projectMembers: ["Megan Ocampo", "Shua Lee", "Michelle La", "Julia Zhu", "Emily Zhang", "Tyler Xiao", "William Jiang", "Lindsay Qin"],
                demoDayUrl: "https://docs.google.com/presentation/d/1R8b3j6r-cqUQ8bFLHnB0_1YX9wHqgCVo9yv-A3DimEc/edit#slide=id.wIXM5XE6",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
            {
                projectName: "SignBridge",
                projectLeads: ["Aahil Ali"],
                projectDescription: "Signbridge is an interactive and personalized platform that uses the power of AI/ML to allow ASL learners to learn ASL accurately and in real time. We’re making learning ASL more accessible, one sign at a time.",
                projectManagers: ["Aahil Ali"],
                projectMembers: ["Katie Chung", "Chelsea Wan", "Soha Baig", "Felicia Chen", "Andrew Liang", "Aadrij Upadya", "Neha Humbe"],
                demoDayUrlhttps: "docs.google.com/presentation/d/1R8b3j6r-cqUQ8bFLHnB0_1YX9wHqgCVo9yv-A3DimEc/edit#slide=id.g31c1bf06f7f_0_7",
                instaPostUrl: "",
                logoUrl: "",
                prototypeUrl: ""
            },
        ],
        winter: [],
        spring: []
    }
};

const QuarterProjectCardList = ( { quarter, year }: QuarterListProps) => {
    return <>
        {allProjects[year][quarter].length > 0 ? allProjects[year][quarter].map(project => <IndividualProjectCard key={project.projectName} {...project} />) : <span className="font-bold">No projects yet!</span>}
        </>
};

export default QuarterProjectCardList;