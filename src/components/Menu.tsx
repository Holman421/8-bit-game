import MenuImg from '../assets/images/menu.png'

type MenuProps = {
    isMenuOpen: boolean
    setIsMenuOpen: (isOpen: boolean) => void
}

const Menu = ({ isMenuOpen, setIsMenuOpen, }: MenuProps) => {
    return (
        <div className={`absolute flex justify-center items-center z-10 w-full md:w-[500px] transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <img src={MenuImg} className="absolute w-full object-cover" alt="Menu Background" />
            <div className='flex flex-col z-2 px-18 md:px-24 items-center w-full'>
                <h1 className="text-4xl md:text-5xl text-center mb-4 text-black font-bold">Vítej bludimíre</h1>
                <p className='text-black text-[18px] text-center'>Jsem ráda ze jsi zavítal sem, na nejlepší interaktivní pozvánku ever na moje ještě lepší oslavu narozenin.</p>
                <p className='text-black text-[18px] mt-3 text-center'>Chtěl by jsi vědět kdy a kde?</p>
                <p className='text-black text-[18px] mb-3 text-center'>Smolík pacholík!</p>
                <p className='text-black text-[18px] text-center'>Vše se dozvíš až projdeš touhle challedží</p>
                <button
                    className="border cursor-pointer mt-6 border-black text-black px-4 py-2 rounded"
                    onClick={() => {
                        setIsMenuOpen(false);
                    }}
                >
                    Začít
                </button>
            </div>
        </div>
    )
}

export default Menu