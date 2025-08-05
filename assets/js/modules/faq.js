export default function faqRespostas(){
    document.addEventListener('DOMContentLoaded', ()=>{
        const faqItem = document.querySelectorAll('.faq-item');


        faqItem.forEach((item)=>{
            const faqQuestion = item.querySelector('.faq-question');

            faqQuestion.addEventListener('click', ()=>{
                faqItem.forEach((outroItem)=>{
                    if(outroItem !== item){
                        outroItem.classList.remove('active');
                    };
                });

                item.classList.toggle('active');
            });
        });
    })
}