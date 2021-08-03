import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  template: `
    
    <mat-card *ngIf="!isScanning" class="mat-elevation-z1" [style.backgroundColor]="cards[0].color">
      <mat-card-header>
        <mat-card-title>{{ cards[0].title }}</mat-card-title>
      </mat-card-header>
      <img mat-card-image src="{{ cards[0].image }}">
      <mat-card-actions>
        <button mat-button color="secondary" (click)="start()" >PLAY</button>
      </mat-card-actions>
    </mat-card>
    

    <ul *ngIf="isScanning">
      <li *ngFor="let card of cards">
        
        <mat-card [attr.id]="'card-' + card.id" class="mat-elevation-z1" [style.backgroundColor]="card.color">
          <mat-card-header>
            <mat-card-title>{{ card.title }}</mat-card-title>
          </mat-card-header>
          <img mat-card-image src="{{ card.image }}">
          <mat-card-actions>
            <button mat-button color="primary" (click)="save(card.id)" >SAVE</button>
            <button mat-button color="secondary" (click)="player.play()" >PLAY</button>
          </mat-card-actions>
        </mat-card>

        <audio [attr.id]="'audio-'+card.id" src="{{ card.audio }}" #player></audio>
        
      </li>
    </ul>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 100px;
    }
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
    }
    li {
      flex: 1;
      padding: 10px;
      display: flex;
      justify-content: center;
    }
    mat-card {
      width: 300px
    }
  `]
})
export class AppComponent {
  cards = [{
    title: 'Giraffe',
    image: '/assets/images/giraffe.jpg',
    id: 'GIRAFFE',
    audio: '/assets/audio/giraffe.mp3',
    color: "#ffffff"
  }, {
    title: 'Mouse',
    image: '/assets/images/mouse.jpg',
    id: 'MOUSE',
    audio: '/assets/audio/mouse.mp3',
    color: "#ffffff"
  }, {
    title: 'Squirrel',
    image: '/assets/images/squirrel.jpg',
    id: 'SQUIRREL',
    audio: '/assets/audio/squirrel.mp3',
    color: "#ffffff"
  }, {
    title: 'Bee',
    image: '/assets/images/bee.jpg',
    id: 'BEE',
    audio: '/assets/audio/bee.mp3',
    color: "#ffffff"
  }, {
    title: 'Monkey',
    image: '/assets/images/monkey.jpg',
    id: 'MONKEY',
    audio: '/assets/audio/monkey.mp3',
    color: "#ffffff"
  }, {
    title: 'Cat',
    image: '/assets/images/cat.jpg',
    id: 'CAT',
    audio: '/assets/audio/cat.mp3',
    color: "#ffffff"
  }, {
    title: 'Rabbit',
    image: '/assets/images/rabbit.jpg',
    id: 'RABBIT',
    audio: '/assets/audio/rabbit.mp3',
    color: "#ffffff"
  }, {
    title: 'Panda',
    image: '/assets/images/panda.jpg',
    id: 'PANDA',
    audio: '/assets/audio/panda.mp3',
    color: "#ffffff"
  }, {
    title: 'Bear',
    image: '/assets/images/bear.jpg',
    id: 'BEAR',
    audio: '/assets/audio/bear.mp3',
    color: "#ffffff"
  }, {
    title: 'Dog',
    image: '/assets/images/dog.jpg',
    id: 'DOG',
    audio: '/assets/audio/dog.mp3',
    color: "#ffffff"
  }];

  isScanning = false;

  constructor(private snackBar: MatSnackBar) { }

  async start() {
    try {
      const ndef = new (window as any).NDEFReader();
      this.isScanning = true;
      await ndef.scan();
      this.notify("Scanning...");

      ndef.addEventListener("readingerror", () => {
        this.notify(`Error reading tag`);
      });

      ndef.addEventListener("reading", ({ message, serialNumber }: { message: any, serialNumber: string }) => {

        for (const record of message.records) {
          this.notify("Record id:    " + record.id);
          switch (record.recordType) {
            case "text":
              const textDecoder = new TextDecoder(record.encoding);
              this.play(textDecoder.decode(record.data));
              this.notify(`Scanned: ${textDecoder.decode(record.data)}`);
              break;
            case "url":
              // TODO: Read URL record with record data.
              break;
            default:
            // TODO: Handle other records with record data.
          }
        }
        this.play('cat');
      });
    } catch (error) {
      this.notify(error);
      this.isScanning = false;
    }
  }

  notify(message: string) {
    this.snackBar.open(message, 'OK');
  }

  async save(id: string) {
    try {
      const ndef = new (window as any).NDEFReader();
      await ndef.write({
        records: [{ recordType: "text", data: id }]
      })
      this.notify(`${id} saved!`);
    } catch (error) {
      this.notify(error);
    }
  }

  play(id: string) {
    const player = document.querySelector(`#audio-${id}`) as HTMLAudioElement;
    const card = document.querySelector(`#card-${id}`) as HTMLElement;
    card.classList.add('mat-elevation-z8');
    card?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    player.play();
    player.onended = () => card.classList.remove('mat-elevation-z8');
    this.notify(id);
  }
}
