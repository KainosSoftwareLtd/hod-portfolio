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

    const phase = this.fb.group({
      startDate: '',
      endDate: ''
    });

    this.myForm = this.fb.group({
      account: '',
      project: '',
      description: '',
      manager: '',
      alpha: phase,
      beta: phase,
      betaToLive: phase,
      live: phase
    });

    this.myForm.valueChanges.subscribe(console.log);
  }

}
