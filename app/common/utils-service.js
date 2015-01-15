
angular.module('eTRIKSdata.utils.service', [

    ])

    .factory('utils', function () {
        return {
            // Util for finding an object by its 'id' property among an array
            findById: function findById(a, id) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i].Id == id) return a[i];
                }
                return null;
            },

            // Util for finding an object by its 'accession' property among an array
            findByAccession: function findByAccession(a, acc) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i].accession == acc){
                        return a[i];
                    }
                }
                return null;
            }
        };
    });