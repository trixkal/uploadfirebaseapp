import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() files: FileItem[] = [];
  @Output() mouseAbove: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    this.mouseAbove.emit(true);
    this.preventStop(event);
  }
  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.mouseAbove.emit(false);
  }
  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    this.mouseAbove.emit(false);
    const transfer = this.getTransfer(event);
    if (!transfer) {
      return;
    }
    this.extractFiles(transfer.files);
    this.preventStop(event);
    this.mouseAbove.emit(false);

  }

  private getTransfer(event: any) {
    return (event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer);
  }


  private extractFiles(fileList: FileList) {
    console.log(fileList);
    // tslint:disable-next-line: forin
    for (const property in Object.getOwnPropertyNames(fileList)) {

      const fileAux = fileList[property];
      if (this.isUploadable(fileAux)) {
        const newFile = new FileItem(fileAux);
        this.files.push(newFile);
      }
    }
    console.log(this.files);
  }

  // validaciones


  private isUploadable(file: File): boolean {
    if (!this.isAlreadyDropped(file.name) && this.isImage(file.type)) {
      return true;
    } else {
      return false;
    }
  }

  private preventStop (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  private isAlreadyDropped(fileName: string): boolean {

    for (const file of this.files) {
      if (file.fileName === fileName) {
        return true;
      }
    }
    return false;
  }

  private isImage(fileType: string): boolean {
    return (fileType === '' || fileType === undefined ? false : fileType.startsWith('image'));
  }
}
