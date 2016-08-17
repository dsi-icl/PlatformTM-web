/**
 * Created by iemam on 03/07/2014.
 */
'use strict'
function studyController($scope,$state,$stateParams,StudyService) {



    var vm = this;

    vm.projectId = $stateParams.projectId;
    vm.studyId = $stateParams.studyId;

    var study;
    if($stateParams.studyId==0){
        console.log("New Project");
        study = new StudyService.getStudyResource();
        // project.ProjectAcc = $stateParams.studyId;//"Study1"
        study.isNew = true;
        study.status = "New";
        study.projectAcc = $stateParams.projectId;
        
        vm.study = study;

    }
    else if($stateParams.studyId){
        StudyService.getStudyResource.get({ studyId: $stateParams.studyId }, function(response){
            study = response;
            study.isNew = false;
            vm.study = study
            console.log(vm.study);
        });
    }
    
    vm.addOobjective = function(){
        if(!vm.study.oObjectives)
            vm.study.oObjectives = [];
        vm.study.oObjectives.push(vm.oo)
    }


    vm.saveStudy = function(){
        if(vm.study.isNew){
            vm.study.$save(function(response) {
                console.log("study created",response);
                toaster.pop('success', "SUCCESS", vm.study.name," was successfully CREATED.",8000);
                //$stateParams.projectId = response.accession;
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            });
        }
        else{
            console.log("study Edited");

            vm.study.$update(function(response) {
                console.log("study Updated");
                toaster.pop('success', "SUCCESS", vm.study.name," was successfully UPDATED.",8000);
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            });
        }
    };

    
    vm.studyForm={}
    vm.studyForm.countries =['Egypt,Honologogog']
    /*vm.studyForm={}
        .countries = ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"];
  */

    vm.availableColors = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];

    vm.multipleDemo = {};
    vm.multipleDemo.colors = ['Blue','Red'];

    /*console.log(ngAppConfig.apiServiceBaseUri);
    

    if($stateParams.studyId == 'S-UBIOP-01')
    {
        $http.get('../data/study-plan.json').success(function(data) {
            //if(data.size == 0)

            vm.Arms = data;
        })
    }else{
        $http.get('../data/study-plan-empty.json').success(function(data) {
            //if(data.size == 0)
            vm.Arms = data;
        })

    }*/
}

angular.module('bioSpeak.config')
    .controller('StudyCtrl',['$scope','$state','$stateParams','StudyService',studyController]);