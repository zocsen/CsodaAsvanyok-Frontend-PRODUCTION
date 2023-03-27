import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'csodaasvanyokapp-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  ngOnInit(): void {
    // mobile menu variables
    const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
    const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
    const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
    const overlay = document.querySelector('[data-overlay]');

    for (let i = 0; i < mobileMenuOpenBtn.length; i++) {

      // mobile menu function
      const mobileMenuCloseFunc = () => {
        mobileMenu[i].classList.remove('active');
        overlay.classList.remove('active');
      };

      mobileMenuOpenBtn[i].addEventListener('click', () => {
        mobileMenu[i].classList.add('active');
        overlay.classList.add('active');
      });

      mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
      overlay.addEventListener('click', mobileMenuCloseFunc);
      
      break;
    }

    // accordion variables
    const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
    const accordion = document.querySelectorAll('[data-accordion]');

    for (let i = 0; i < accordionBtn.length; i++) {

      accordionBtn[i].addEventListener('click', () => {

        console.log("hello");

        const clickedBtn = accordionBtn[i].nextElementSibling?.classList.contains('active');

        for (let i = 0; i < accordion.length; i++) {

          if (clickedBtn) break;

          if (accordion[i].classList.contains('active')) {

            accordion[i].classList.remove('active');
            accordionBtn[i].classList.remove('active');

          }

        }

        accordionBtn[i].nextElementSibling?.classList.toggle('active');
        accordionBtn[i].classList.toggle('active');
      });
    }
  }
}