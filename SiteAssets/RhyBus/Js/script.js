// $(document).ready(function(){
//     activeLinkControl()

// });



// function activeLinkControl(){
//     $('.menu li a').click(function(){
//         $('li').removeClass('anchoractive')
//         $(this).closest('.nav-tem').addClass('anchoractive')
//     })
// }

const activePage = window.location.pathname;
const navLinks = document.querySelectorAll('.menu li a');
navLinks.forEach(link=>{

    console.log(link.href);

    if(link.href.includes(`${activePage}`) ){
        link.classList.add('anchoractive')
    }
})