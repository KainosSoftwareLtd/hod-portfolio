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

    const phase = {
      startDate: '',
      endDate: ''
    };

    this.myForm = this.fb.group({
      account: '',
      project: '',
      description: '',
      manager: '',
      phases: this.fb.group({
        alpha: this.fb.group(phase),
        beta: this.fb.group(phase),
        betaToLive: this.fb.group(phase),
        live: this.fb.group(phase)
      })
    });

    this.myForm.valueChanges.subscribe(console.log);
  }

}
