import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item';
import { UploaderService } from '../../services/uploader.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styles: []
})
export class UploadComponent implements OnInit {

  files: FileItem[] = [];
  isOnDrop = false;
  
  constructor(public loadimagesService: UploaderService) { }

  ngOnInit(): void {
  }

  loadImages() {
    this.loadimagesService.loadImagesFirebase(this.files);
  }

  cleanImages() {
    this.files = [];
  }
}
