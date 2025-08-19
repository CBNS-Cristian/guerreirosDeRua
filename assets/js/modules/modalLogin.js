export default function modalLogin(){
    document.addEventListener('DOMContentLoaded', ()=>{
        const modal = document.querySelector('#loginModal');
        const openBtn = document.querySelector('#openLoginModal');
        const closeBtn = document.querySelector('.close-modal');

        if(openBtn){
            openBtn.addEventListener('click', ()=>{
                modal.style.display = 'flex';
                document.body.style.overflow = 'auto';
            });
        }

        if(closeBtn){
            closeBtn.addEventListener('click', ()=>{
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            })
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            }
        });
        
        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            }
        });
    })
}

