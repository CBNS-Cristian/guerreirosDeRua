export default function menuHamburguer(){
    document.addEventListener('DOMContentLoaded', ()=>{
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav');
        const sobrepor = document.createElement('div');

        sobrepor.className = 'overlay';

        document.body.appendChild(sobrepor);

        menuToggle.addEventListener('click', (item)=>{
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            sobrepor.classList.toggle('active');

            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });

        sobrepor.addEventListener('click', ()=>{
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            sobrepor.classList.remove('active');

        });

        const linkNav = document.querySelectorAll('.nav-list a');
        linkNav.forEach((item)=>{
            item.addEventListener('click', ()=>{
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                sobrepor.classList.remove('active');
            });
        });

        document.addEventListener('keydown', (e)=>{
            if(e.key === 'Escape' && navMenu.classList.contains('active')){
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                sobrepor.classList.remove('active');
            }
        });
    });
}