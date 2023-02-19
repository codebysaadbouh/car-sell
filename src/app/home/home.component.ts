import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router
  ) {

  }

  title = 'car-sell';
  idParagraph = 'firstID';
  classParagraph = 'customClass';
  displayName = false;
  nom = '';
  display = true;
  cars = [
    {
      id: 1,
      name: 'BMW',
      model: 'X5',
      year: 2019,
      color: 'black',
    },
    {
      id: 2,
      name: 'Mercedes',
      model: 'C200',
      year: 2018,
      color: 'white',
    },
    {
      id: 3,
      name: 'Audi',
      model: 'A4',
      year: 2017,
      color: 'red',
    }
  ]

  displayNom() : void {
    if (this.nom.replace(/\s/g, "").length > 0) {
      this.displayName = true;
    }else {
      this.displayName = false;
    }
  }

  onClickButton() : void {
    console.log(this.display)
    this.display = !this.display;
  }

  ngOnInit() {
    console.log(this.nom)
    $(function(){
      $('#firstID').text('My New Text');
      $('.customClass').text('Titre Dynamique').addClass('lead').removeClass('customClass');
    })
  }
  onLogin() : void {
    this.router.navigate(['/admin','dashboard']).then(r => console.log(r));
    //this.router.navigateByUrl('/admin/dashboard').then(r => console.log(r));
  }

}
