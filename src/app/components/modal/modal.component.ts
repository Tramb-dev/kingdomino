import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  pseudo: string = '';
  @Input() modalOpened: boolean = false;

  @Output() modalClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modalEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    
  }

  validateForm(form: NgForm): void {
    if(form.valid) {
      this.modalEvent.emit(form.value.pseudo);
    }
  }

  close(): void {
    this.modalOpened = false;
    this.modalClose.emit(false);
  }

}
