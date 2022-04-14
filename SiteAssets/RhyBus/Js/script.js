const activePage = window.location.pathname;
const navLinks = document.querySelectorAll('.menu li a');
navLinks.forEach(link=>{

    if(link.href.includes(`${activePage}`) ){
        link.classList.add('anchoractive')
    }
})