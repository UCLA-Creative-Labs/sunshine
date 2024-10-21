export default function Footer() {
    return (
        <footer className="flex flex-col md:flex-row space-y-8 md:space-y-0 justify-between items-center tracking-wide min-w-full bg-black py-10 sm:px-20">
            <div className="flex items-center">
                <p className="text-xl md:text-xl">Made with ❤️ by &nbsp;</p> 
                <h1 className="text-xl md:text-xl font-bold">CREATIVE LABS</h1>
            </div>
            <div className="flex space-x-4 md:space-x-8">
                <a className="text-xl" target='_blank' rel='noreferrer' href='https://www.instagram.com/creativelabsucla/'>INSTAGRAM</a>
                <a className="text-xl" target='_blank' rel='noreferrer' href='https://discord.gg/vHenfGNTXJ'>DISCORD</a>
            </div>
        </footer>
    )
}