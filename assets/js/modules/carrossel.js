export default function carrossel(){
    document.addEventListener('DOMContentLoaded', ()=>{
        const container = document.querySelector('.carrossel-container');
        const slide = document.querySelectorAll('.slide');
        let indexAtual = 1;

        function atualizarCarrossel() {
            const posicoes = [100, 0, -100, -200]; // Valores em %
            container.style.transform = `translateX(${posicoes[indexAtual]}%)`;
        }

        function proximoSlide() {
            indexAtual = (indexAtual + 1) % slide.length;
            atualizarCarrossel();
        }

        function slideAnterior() {
            indexAtual = (indexAtual - 1 + slide.length) % slide.length;
            atualizarCarrossel();
        }

        // Inicializa
        atualizarCarrossel();

        let intervalo = setInterval(proximoSlide, 5000);
    })
}