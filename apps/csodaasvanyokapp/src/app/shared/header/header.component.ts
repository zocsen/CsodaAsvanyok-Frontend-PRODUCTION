import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2} from '@angular/core';
import { CartService } from '@csodaasvanyok-frontend-production/orders';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'csodaasvanyokapp-header',
  templateUrl: './header.component.html',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class HeaderComponent implements OnInit {
  menuState: string;
  cartCount = 0;

  constructor(
    private cartService: CartService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.items.length;
    })
    this.cartCount = this.cartService.getCart().items.length;

    this.cartService.menuState$.subscribe(state => {
      this.menuState = state;
      if (state === 'in') {
        this.renderer.addClass(this.document.body, 'no-scroll');
      }
    });


  // mobile menu variables
  const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
  const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
  const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
  const overlay = document.querySelector('[data-overlay]');

  for (let i = 0; i < mobileMenuOpenBtn.length; i++) {
    mobileMenuOpenBtn[i].addEventListener('click', () => {
      mobileMenu[i].classList.add('active');
      overlay.classList.add('active');
    });
  }

    mobileMenuCloseBtn.forEach(btn => {
      btn.addEventListener('click', () => {
        mobileMenu.forEach(menu => menu.classList.remove('active'));
        overlay.classList.remove('active');
      });
    });

    overlay.addEventListener('click', () => {
      mobileMenu.forEach(menu => menu.classList.remove('active'));
      overlay.classList.remove('active');
    });
    
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

  openCartPanel() {
    this.cartService.openMenu();
  }

}