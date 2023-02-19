import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import * as $ from "jquery";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Announce} from "../../interfaces/announce";
import {AnnouncesService} from "../../services/announces.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  announceForm!: FormGroup
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
  announces: Announce[] = []
  currentAnnouncePhotoUrl: any;

  subscription!: Subscription
  currentAnnouncePhotoFile: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private announceService: AnnouncesService
  )  { }

  ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }


  currentCar: any;

  initOfferForm():void {
    this.announceForm = this.formBuilder.group({
      id       : [null],
      brand       : ['', [Validators.required, Validators.maxLength(75)]],
      photo       : [],
      model       : ['', Validators.required],
      description : ['', Validators.required],
      price       : ['', Validators.required],
    })
  }

  ngOnInit(): void {

    this.subscription = this.announceService.announcesSubject.subscribe(
      {
        next: (announces  ) => {
          console.log("Next");
          this.announces = announces
        },
        error: () => {
          console.log('Error');
        },
      })

    this.announceService.getAnnounces();

    let carId = this.activatedRoute.snapshot.paramMap.get('id');

    this.currentCar = this.cars.find(car => car.id == +<string>carId);

    this.initOfferForm()
  }
  onSubmitAnnounceForm() : void {
    const announceId = this.announceForm.value.id;
    let announce = this.announceForm.value;
    const announcePhotoUrl = this.announces.find((announce) => announce.id === announceId)?.photo;
    announce ={...announce, photo: announcePhotoUrl}
    if(!announceId || announceId === "") { // CREATE
      delete announce.id;
      this.announceService.createAnnounce(announce, this.currentAnnouncePhotoFile).catch((error) => {console.log(error)})
    } else { // UPDATE
      delete announce.id;
      this.announceService.editAnnounce(announce, announceId, this.currentAnnouncePhotoFile).catch((error) => {console.log(error)});
    }
    this.announceForm.reset();
    this.currentAnnouncePhotoFile = null;
    this.currentAnnouncePhotoUrl = null;
    console.log(this.announceForm.value);
  }

  onEditAnnounce(announce: any) {
    this.currentAnnouncePhotoUrl = announce.photo ? announce.photo : '';
    this.announceForm.setValue({
      id: announce.id ? announce.id : '',
      brand: announce.brand ? announce.brand : '',
      photo: '',
      model: announce.model ? announce.model : '',
      description: announce.description ? announce.description : '',
      price: announce.price ? announce.price : 0,
    });
  }

  onDeleteAnnounce(announceID?: string) : void {
    if (announceID){
      this.announceService.deleteAnnounce(announceID).catch((error) => {console.log(error)});
    }else {
      console.error("No announce ID provided");
    }
  }

  onChangeAnnouncePhoto($event: any) : void {
    this.currentAnnouncePhotoFile = $event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(this.currentAnnouncePhotoFile);
    fileReader.onloadend = (e) => {
      this.currentAnnouncePhotoUrl = <string>e.target?.result;
    }
  }
}


