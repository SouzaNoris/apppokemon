import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  hideLoader: boolean = true;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.loader.subscribe((loader) => {
      this.hideLoader = loader;
    });
  }
}
