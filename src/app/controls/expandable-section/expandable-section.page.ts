import { Component, OnInit, ViewChild, Input, ElementRef, ChangeDetectorRef, Renderer } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-expandable-section',
  templateUrl: './expandable-section.page.html',
  styleUrls: ['./expandable-section.page.scss'],
})
export class ExpandableSectionPage implements OnInit {

  // tslint:disable-next-line: variable-name
  constructor(private _global: GlobalService, private _cdRef: ChangeDetectorRef, private renderer: Renderer) {
  }

  @ViewChild('expandWrapper', { read: ElementRef, static: true }) expandWrapper;
  // tslint:disable-next-line: no-input-rename
  @Input('expanded') expanded;
  // tslint:disable-next-line: no-input-rename
  @Input('expandHeight') expandHeight: string;

  ngOnInit() {
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit() {
    this.renderer.setElementStyle(this.expandWrapper.nativeElement, 'height', this.expandHeight + 'px');
  }

  ionViewDidLoad() {
    this._global.showConsoleLog('ionViewDidLoad ExpandableSection page', '');

  }
}
