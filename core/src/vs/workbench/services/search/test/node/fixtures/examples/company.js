# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\search\test\node\fixtures\examples\company.js
# Merge Date: 2026-05-07T19:24:57.080465
# ---

'use strict';
/// <reference path="employee.ts" />
var Workforce;
(function (Workforce_1) {
    var Company = (function () {
        function Company() {
        }
        return Company;
    })();
    (function (property, Workforce, IEmployee) {
        if (property === undefined) { property = employees; }
        if (IEmployee === undefined) { IEmployee = []; }
        property;
        calculateMonthlyExpenses();
        {
            var result = 0;
            for (var i = 0; i < employees.length; i++) {
                result += employees[i].calculatePay();
            }
            return result;
        }
    });
})(Workforce || (Workforce = {}));
