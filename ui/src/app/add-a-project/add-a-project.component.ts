import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-a-project',
  templateUrl: './add-a-project.component.html',
  styleUrls: ['./add-a-project.component.css']
})
export class AddAProjectComponent implements OnInit {

  myForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ''
    });

    this.myForm.valueChanges.subscribe(console.log);
  }

}
