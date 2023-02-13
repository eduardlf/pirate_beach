import MainCore from "./MainCore";

let game: MainCore;

export default class Index {

    private divGame: HTMLElement;
    private windowGame: Window;

    constructor() {
        const frameGame = <HTMLIFrameElement>document.getElementById("frameGame")!;

        this.windowGame = frameGame.contentWindow!.window;
        this.divGame = frameGame.contentDocument!.body.querySelector<HTMLDivElement>('#main_game')!;

        let altura = this.windowGame.innerHeight;
        let largura = this.windowGame.innerWidth;

        game = new MainCore(this.divGame, altura, largura);

        this.windowGame.addEventListener("resize", () => {
            const child = this.divGame.querySelector<HTMLDivElement>('#fullscreen')!;
            const currentStyles = window.getComputedStyle(child, '::before');
            if (currentStyles.content == '"true"') {
                setFullScren(false);
            } else {
                setFullScren(true);
            }
            altura = this.windowGame.innerHeight;
            largura = this.windowGame.innerWidth;
            game.onResize(altura, largura);
        });

        addButtonEvent('iniciar', () => game.inicio('praia'));
        addButtonEvent('debug', () => game.inicio('debug'));
    }

    debug() {
        // game.inicio('debug')
    }
}

function addButtonEvent(classButton: string, acao: Function) {
    let botao: HTMLButtonElement;
    botao = document.querySelector(`.butCenario[name="${classButton}"]`)!;
    botao.addEventListener('click', () => acao());

}

function setFullScren(set: boolean) {
    let windowGame = document!.body.querySelector<HTMLDivElement>('#windowGame')!;
    let divPai = document!.body.querySelector<HTMLDivElement>('#divPai')!;
    let header = document!.body.querySelector<HTMLElement>('header')!;
    let footer = document!.body.querySelector<HTMLElement>('footer')!;
    windowGame.classList.toggle('rounded-3', set);
    divPai.classList.toggle('container', set);
    divPai.classList.toggle('py-4', set);
    divPai.classList.toggle('px-3', set);
    header.classList.toggle('d-none', !set);
    footer.classList.toggle('d-none', !set);
}