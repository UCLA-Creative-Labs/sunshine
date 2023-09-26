export default function Card({ title, text }: { title: string, text: string}) {
    return (
        <div className="
            flex flex-col items-center 
            transition ease-in-out delay-50 
            hover:scale-110 
            max-w-[200px]
            lg:max-w-[300px]
            rounded-md
            shadow-lg
            overflow-hidden
            "
        >
            <img
                className="shadow-md"
                src="https://img.freepik.com/free-vector/cute-shark-swimming-cartoon-icon-illustration_138676-2245.jpg?w=360"
            />
            <div className="flex flex-col w-full p-8">
                <h1 className="font-bold text-xl">{title}</h1>
                <h2 className="text-lg">{text}</h2>
            </div>
        </div>
    )
}