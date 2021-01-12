import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leaveApprovalEmployeeFilter'
})
export class LeaveApprovalEmployeeFilterPipe implements PipeTransform {
  transform(items: any[], field: string, searchKey: string): any[] {
    if (!items) { return []; }

    if (!searchKey) { return items; }
    searchKey = searchKey.toLowerCase();

    return items.filter(item => {
      if (item.EMPLOYEE_NAME != null) {
        return (item.EMPLOYEE_NAME.toLowerCase().includes(searchKey));
      }
    });
  }
}
