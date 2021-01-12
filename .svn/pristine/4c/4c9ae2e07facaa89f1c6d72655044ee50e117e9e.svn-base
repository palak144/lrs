import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'managerDashboardFilter'
})
export class ManagerDashboardFilterPipe implements PipeTransform {
  transform(items: any[], field: string, searchKey: string): any[] {
    if (!items) { return []; }

    if (!searchKey) { return items; }
    searchKey = searchKey.toLowerCase();

    return items.filter(item => {
      if (item.employeeName != null) {
        return (item.employeeName.toLowerCase().includes(searchKey) || item.employeeNumber.toLowerCase().includes(searchKey));
      }
    });
  }
}
