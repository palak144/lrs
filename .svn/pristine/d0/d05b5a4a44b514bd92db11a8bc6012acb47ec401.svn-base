"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var calendar_controller_1 = require("./calendar.controller");
var angular_1 = require("@ionic/angular");
var calendar_service_1 = require("./services/calendar.service");
var index_1 = require("./components/index");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
function calendarController(modalCtrl, calSvc) {
    return new calendar_controller_1.CalendarController(modalCtrl, calSvc);
}
exports.calendarController = calendarController;
var IonicModuleForRoot = angular_1.IonicModule.forRoot();
var CalendarModule = /** @class */ (function () {
    function CalendarModule() {
    }
    CalendarModule = __decorate([
        core_1.NgModule({
            imports: [
                IonicModuleForRoot,
                forms_1.FormsModule,
                common_1.CommonModule
            ],
            declarations: index_1.CALENDAR_COMPONENTS,
            exports: index_1.CALENDAR_COMPONENTS,
            entryComponents: index_1.CALENDAR_COMPONENTS,
            providers: [
                calendar_service_1.CalendarService,
                {
                    provide: calendar_controller_1.CalendarController,
                    useFactory: calendarController,
                    deps: [angular_1.ModalController, calendar_service_1.CalendarService]
                }
            ],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
        })
    ], CalendarModule);
    return CalendarModule;
}());
exports.CalendarModule = CalendarModule;
//# sourceMappingURL=calendar.module.js.map