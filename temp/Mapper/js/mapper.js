var mapperApp =angular.module('eTRIKSdata.mapper',['ngDragDrop']);


mapperApp.config(function($stateProvider, $urlRouterProvider) {
    //$urlRouterProvider.when('', 'Mapper/default.html');
    $stateProvider
        // route to show our basic form (/form)
        .state('mapper', {
            url: '/Mapper',
            templateUrl: '..//main.html',
            controller: 'dragAndDropController',
            data:{domainName:''}
        })

            //findings -vital Signs
            .state('mapper.VitalSigns',{
                url:'/VitalSigns',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Vital Signs';
                $scope.shortName ='VS';
            }
            })
                .state('mapper.VitalSigns.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                    .state('mapper.VitalSigns.Submission.Confirm',{
                        url:'/Confirm',
                        templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                    })

            .state('mapper.DrugAccountability',{
                 url:'/DrugAccountability',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Drug Accountability';
                $scope.shortName ='DA';
            }
            })
                .state('mapper.DrugAccountability.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                    .state('mapper.DrugAccountability.Submission.Confirm',{
                        url:'/Confirm',
                        templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                    })

            .state('mapper.DeathDetails',{
                url:'/DeathDetails',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Death Details';
                $scope.shortName ='DD';
            }
            })
                .state('mapper.DeathDetails.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.DeathDetails.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.ECGTestResults',{
                url:'/ECGTestResults',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='ECG Test Results';
                $scope.shortName ='EG';
            }
            })
                .state('mapper.ECGTestResults.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.ECGTestResults.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.InclusionExclusionCritierionNotMet',{
                url:'/InclusionExclusionCritierionNotMet',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Inclusion/Exclusion Critierion Not Met';
                $scope.shortName ='IE';
            }
            })
                .state('mapper.InclusionExclusionCritierionNotMet.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.InclusionExclusionCritierionNotMet.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.ImmunogenicitySpecimenAccessments',{
                url:'/ImmunogenicitySpecimenAccessments',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Immunogenicity Specimen Accessments ';
                $scope.shortName ='IS';
            }
            })
                .state('mapper.ImmunogenicitySpecimenAccessments.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.ImmunogenicitySpecimenAccessments.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.LaboratoryTestResults',{
                url:'/LaboratoryTestResults',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Laboratory Test Results';
                $scope.shortName ='LB';
            }
            })
                .state('mapper.LaboratoryTestResults.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.LaboratoryTestResults.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.MicrobiologySpecimen',{
                url:'/MicrobiologySpecimen',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Microbiology Specimen';
                $scope.shortName ='MB';
            }
            })
                .state('mapper.MicrobiologySpecimen.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.MicrobiologySpecimen.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.MicroscopicFindings',{
                url:'/MicroscopicFindings',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Microscopic Findings';
                $scope.shortName ='MI';
            }
            })
                .state('mapper.MicroscopicFindings.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.MicroscopicFindings.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.Morphology',{
                url:'/Morphology',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Morphology';
                $scope.shortName ='MO';
            }
            })
                .state('mapper.Morphology.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.Morphology.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.MicrobiologySusceptibilityTest',{
                url:'/MicrobiologySusceptibilityTest',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Microbiology Susceptibility Test';
                $scope.shortName ='MS';
            }
            })
                .state('mapper.MicrobiologySusceptibilityTest.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.MicrobiologySusceptibilityTest.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.PKConcentrations',{
                url:'/PKConcentrations',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='PK Concentrations';
                $scope.shortName ='PC';
            }
            })
                .state('mapper.PKConcentrations.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.PKConcentrations.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.PKParameters',{
                url:'/PKParameters',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='PK Parameters';
                $scope.shortName ='PP';
            }
            })
                .state('mapper.PKParameters.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.PKParameters.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.PhysicalExamination',{
                url:'/PhysicalExamination',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Physical Examination';
                $scope.shortName ='PE';
            }
            })
                .state('mapper.PhysicalExamination.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.PhysicalExamination.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.Questionnaires',{
                url:'/Questionnaires',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Questionnaires';
                $scope.shortName ='QS';
            }
            })
                .state('mapper.Questionnaires.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.Questionnaires.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.ReproductiveSystemFindings',{
                url:'/ReproductiveSystemFindings',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Reproductive System Findings';
                $scope.shortName ='RP';
            }
            })
                .state('mapper.ReproductiveSystemFindings.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.ReproductiveSystemFindings.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.DiseaseResponse',{
                url:'/DiseaseResponse',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Disease Response';
                $scope.shortName ='RS';
            }
            })
                .state('mapper.DiseaseResponse.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.DiseaseResponse.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.SubjectCharacteristics',{
                url:'/SubjectCharacteristics',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Subject Characteristics';
                $scope.shortName ='SC';
            }
            })
                .state('mapper.SubjectCharacteristics.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.SubjectCharacteristics.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.SubjectStatus',{
                url:'/SubjectStatus',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Subject Status';
                $scope.shortName ='SS';
            }
            })
                .state('mapper.SubjectStatus.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.SubjectStatus.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.TumorIdentification',{
                url:'/TumorIdentification',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Tumor Identification';
                $scope.shortName ='TU';
            }
            })
                .state('mapper.TumorIdentification.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.TumorIdentification.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })

            .state('mapper.TumorResults',{
                url:'/TumorResults',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Tumor Results';
                $scope.shortName ='TR';
            }
            })
                .state('mapper.TumorResults.Submission',{
                    url:'/Submission',
                    templateUrl:'..//standardFormParts/Findings/SubmitTable.html'
                })

                .state('mapper.TumorResults.Submission.Confirm',{
                    url:'/Confirm',
                    templateUrl:'..//standardFormParts/Findings/ConfirmTable.html'
                })



             //Interventions
            .state('mapper.ConcomitantMedications',{
                url:'/ConcomitantMedications',
                templateUrl:'..//standardFormParts/Interventions/ConcomitantMedications.html',
                controller:function($scope){
                $scope.domainName='Concomitant Medications';
                $scope.shortName ='CM';
            }
            })
            .state('mapper.ExposureasCollected',{
                url:'/ExposureasCollected',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Exposureas Collected';
                $scope.shortName ='EC';
            }
            })
            .state('mapper.Exposure',{
                url:'/Exposure',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Exposure';
                $scope.shortName ='EX';
            }
            })
            .state('mapper.SubstanceUse',{
                url:'/SubstanceUse',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Substance Use';
                $scope.shortName ='SU';
            }
            })
            .state('mapper.Procedures',{
                url:'/Procedures',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Procedures';
                $scope.shortName ='PR';
            }
            })

            //Events
            .state('mapper.AdverseEvents',{
                url:'/AdverseEvents',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Adverse Events';
                $scope.shortName ='AE';
            }
            })
            .state('mapper.ClinicalEvents',{
                url:'/ClinicalEvents',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Clinical Events';
                $scope.shortName ='CE';
            }
            })
            .state('mapper.Disposition',{
                url:'/Disposition',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Disposition';
                $scope.shortName ='DS';
            }
            })
            .state('mapper.ProtocolDeviations',{
                url:'/ProtocolDeviations',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Protocol Deviations';
                $scope.shortName ='DV';
            }
            })
            .state('mapper.HealthcareEncounters',{
                url:'/HealthcareEncounters',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='Healthcare Encounters';
                $scope.shortName ='HO';
            }
            })
            .state('mapper.MedicalHistory',{
                url:'/MedicalHistory',
                templateUrl:'..//standardFormParts/Findings/VitalSigns.html',
                controller:function($scope){
                $scope.domainName='MedicalHistory';
                $scope.shortName ='MH';
            }
            })

    //Help Section
        //Findings:
            .state('mapper.FindingsHelp',{
                url:'/FindingsHelp',
                templateUrl:'..//standardFormParts/Help/Findings.html'

            })
                .state('mapper.FindingsHelp.DA',{
                    url:'/DA',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='DA';}
                    })
                .state('mapper.FindingsHelp.DD',{
                    url:'/DD',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='DD';}
                })
                .state('mapper.FindingsHelp.EG',{
                    url:'/EG',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='EG';}
                })

                .state('mapper.FindingsHelp.IE',{
                    url:'/IE',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='IE';}
                })
                .state('mapper.FindingsHelp.IS',{
                    url:'/IS',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='IS';}
                })
                .state('mapper.FindingsHelp.LB',{
                    url:'/LB',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='LB';}
                })
                .state('mapper.FindingsHelp.MB and MS',{
                    url:'/MB and MS',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='MB and MS';}
                })
                .state('mapper.FindingsHelp.MI',{
                    url:'/MI',
                     templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='MI';}
                })
                .state('mapper.FindingsHelp.MO',{
                    url:'/MO',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='MO';}
                })
                .state('mapper.FindingsHelp.PC and PP',{
                    url:'/PC and PP',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='PC and PP';}
                })
                .state('mapper.FindingsHelp.PE',{
                    url:'/PE',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='PE';}
                })
                .state('mapper.FindingsHelp.QS',{
                    url:'/QS',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='QS';}
                })
                .state('mapper.FindingsHelp.RP',{
                    url:'/RP',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='RP';}
                })
                .state('mapper.FindingsHelp.SC',{
                    url:'/SC',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='SC';}
                })
                .state('mapper.FindingsHelp.SS',{
                    url:'/SS',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='SS';}
                })
                .state('mapper.FindingsHelp.TU TR and SR',{
                    url:'/TU TR and SR',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='TU TR and SR';}
                })
                .state('mapper.FindingsHelp.TU',{
                    url:'/TU',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='TU';}
                })
                .state('mapper.FindingsHelp.TR',{
                    url:'/TR',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='TR';}
                })
                .state('mapper.FindingsHelp.SR',{
                    url:'/SR',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='SR';}
                })
                .state('mapper.FindingsHelp.VS',{
                    url:'/VS',
                    templateUrl:'..//standardFormParts/Help/Findings/FindingsDomain.html',
                    controller:function($scope){$scope.photoName='VS';}
                })


        //Intervertions:
            .state('mapper.InterventionsHelp',{
                url:'/mapper/InterventionsHelp',
                templateUrl:'..//standardFormParts/Help/Interventions.html'
            })

                .state('mapper.InterventionsHelp.CM',{
                    url:'/CM',
                    templateUrl:'..//standardFormParts/Help/Interventions/InterventionsDomain.html',
                    controller:function($scope){$scope.photoName='CM';}
                })
                .state('mapper.InterventionsHelp.EX',{
                    url:'/EX',
                    templateUrl:'..//standardFormParts/Help/Interventions/InterventionsDomain.html',
                    controller:function($scope){$scope.photoName='EX';}
                })
                .state('mapper.InterventionsHelp.EC',{
                    url:'/EC',
                    templateUrl:'..//standardFormParts/Help/Interventions/InterventionsDomain.html',
                    controller:function($scope){$scope.photoName='EC';}
                })
                .state('mapper.InterventionsHelp.PR',{
                    url:'/PR',
                    templateUrl:'..//standardFormParts/Help/Interventions/InterventionsDomain.html',
                    controller:function($scope){$scope.photoName='PR';}
                })
                .state('mapper.InterventionsHelp.SU',{
                    url:'/SU',
                    templateUrl:'..//standardFormParts/Help/Interventions/InterventionsDomain.html',
                    controller:function($scope){$scope.photoName='SU';}
                })



        //Events:
            .state('mapper.EventsHelp',{
                url:'/mapper/EventsHelp',
                templateUrl:'..//standardFormParts/Help/Events.html'

            })
                .state('mapper.EventsHelp.AE',{
                    url:'/AE',
                    templateUrl:'..//standardFormParts/Help/Events/EventsDomain.html',
                    controller:function($scope){$scope.photoName='AE';}
                })
                .state('mapper.EventsHelp.CE',{
                    url:'/CE',
                    templateUrl:'..//standardFormParts/Help/Events/EventsDomain.html',
                    controller:function($scope){$scope.photoName='CE';}
                })
                .state('mapper.EventsHelp.DS',{
                    url:'/DS',
                    templateUrl:'..//standardFormParts/Help/Events/EventsDomain.html',
                    controller:function($scope){$scope.photoName='DS';}
                })
                .state('mapper.EventsHelp.DV',{
                    url:'/DV',
                    templateUrl:'..//standardFormParts/Help/Events/EventsDomain.html',
                    controller:function($scope){$scope.photoName='DV';}
                })
                .state('mapper.EventsHelp.HO',{
                    url:'/HO',
                    templateUrl:'..//standardFormParts/Help/Events/EventsDomain.html',
                    controller:function($scope){$scope.photoName='HO';}
                })
                .state('mapper.EventsHelp.MH',{
                    url:'/MH',
                    templateUrl:'..//standardFormParts/Help/Events/EventsDomain.html',
                    controller:function($scope){$scope.photoName='MH';}
                })


});

mapperApp.controller('czDropDownMenuController',function($scope){
        $scope.findings=[
            {name:'Drug Accountability (DA)', link:".DrugAccountability"},
            {name:'Death Details (DD)', link:".DeathDetails"},
            {name:'ECG Test Results (EG)', link:".ECGTestResults"},
            {name:'Inclusion/Exclusion Critierion Not Met (IE)', link:".InclusionExclusionCritierionNotMet"},
            {name:'Immunogenicity Specimen Accessments (IS)', link:".ImmunogenicitySpecimenAccessments"},
            {name:'Laboratory Test Results (LB)', link:".LaboratoryTestResults"},
            {name:'Microbiology Specimen (MB)', link:".MicrobiologySpecimen"},
            {name:'Microscopic Findings (MI)', link:".MicroscopicFindings"},
            {name:'Morphology (MO)', link:".Morphology"},
            {name:'Microbiology Susceptibility Test (MS)', link:".MicrobiologySusceptibilityTest"},
            {name:'PK Concentrations (PC)', link:".PKConcentrations"},
            {name:'PK Parameters (PP)', link:".PKParameters"},
            {name:'Physical Examination (PE)', link:".PhysicalExamination"},
            {name:'Questionnaires (QS)', link:".Questionnaires"},
            {name:'Reproductive System Findings (RP)', link:".ReproductiveSystemFindings"},
            {name:'Disease Response (RS)', link:".DiseaseResponse"},
            {name:'Subject Characteristics (SC)', link:".SubjectCharacteristics"},
            {name:'Subject Status (SS)', link:".SubjectStatus"},
            {name:'Tumor Identification (TU)', link:".TumorIdentification"},
            {name:'Tumor Results (TR)', link:".TumorResults"},
            {name:'Vital Signs (VS)', link:".VitalSigns"}
        ];
        $scope.interventions=[
            {name:'Concomitant Medications (CM)', link:".ConcomitantMedications"},
            {name:'Exposure as Collected (EC)', link:".ExposureasCollected"},
            {name:'Exposure (EX)', link:".Exposure"},
            {name:'Substance Use (SU)', link:".SubstanceUse"},
            {name:'Procedures (PR)', link:".Procedures"}
        ];
        $scope.events=[
            {name:'Adverse Events (AE)', link:".AdverseEvents"},
            {name:'Clinical Events (CE)', link:".ClinicalEvents"},
            {name:'Disposition (DS)', link:".Disposition"},
            {name:'Protocol Deviations (DV)', link:".ProtocolDeviations"},
            {name:'Healthcare Encounters (HO)', link:".HealthcareEncounters"},
            {name:'Medical History (MH)', link:".MedicalHistory"}
        ];

    });





mapperApp.controller('dragAndDropController', function($scope, $timeout) {

    $scope.usubj = "ib";
    //Array to store the mapping variable for identifier
    $scope.identifierList = [];
    //Array to store the static and input data for identifier
    $scope.identifierInput={};
    // Two dimentional array to store all tests. Each test may contain several variables
    $scope.testsList= [[]];


    $scope.testNumberList=[1];
    $scope.testCount=1;



    $scope.getDomainName = function(){
        return  $scope.domainName;
    };
    $scope.getShortName = function(){
        return  $scope.shortName;
    };
    $scope.getIdentifierInput =function(){
        return $scope.identifierInput;
    };

    $scope.addNewTest =function(){
        $scope.testCount++;
        $scope.testNumberList.push($scope.testCount);
        $scope.testsList.push([]);
        angular.forEach($scope.FindingStandardData.obsVariables, function(val, key) {
            $scope.testsList[$scope.testCount-1].push({});
        });

    };

    $scope.removeNewTest = function(index){
        $scope.testNumberList.splice(index-1,1);
        $scope.testCount--;

    };
    $scope.getTestNumber = function() {
        return $scope.testNumberList;
    };
    $scope.getTestByIndex=function(testIndex){
        return $scope.testsList[testIndex-1];
    };
    $scope.getStandardName = function(userInput){
        //if(userInput.contains('_')){

        //First Replace Special Characters with Space :heart_test-> heart test
        newUserInput =userInput;
        if(/^[a-zA-Z0-9 ]*$/.test(newUserInput) == false) {
            newUserInput = newUserInput.replace(/[&@\/\\#,+()$~%.'":*?<>_{}-]/g, ' ');
        }
        //Capitalized Each World's first character heart test -> Heart Test
        newUserInput= newUserInput.replace(/\w\S*/g,
            function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        //newUserInput= newUserInput.charAt(0).toUpperCase() + newUserInput.slice(1);
        return newUserInput;
    };

    //$scope.setTESTCD =function(testIndex,input){
    //    $scope.testsList[testIndex-1].push({TESTCD:'input'});
    //}

    $scope.getUploadEntities = function(index,name){
        //return upLoadVariablesDetails.patient_code;
        switch(name){
            case "patient_code":
                return $scope.uploadVariablesDetails[index].patient_code;

            case "systolic_blood_pressure":
                return $scope.uploadVariablesDetails[index].systolic_blood_pressure;

            case"diastolic_blood_pressure":
                return $scope.uploadVariablesDetails[index].diastolic_blood_pressure;

            case"heart_rate":
                return $scope.uploadVariablesDetails[index].heart_rate;

            case"respiratory_rate":
                return $scope.uploadVariablesDetails[index].respiratory_rate;

            case "visit_date":
                return $scope.uploadVariablesDetails[index].visit_date;

            default:
                return {};

        }
    };

    $scope.getIdentifierFirstVar = function(){
        return $scope.identifierList[0].title;
    };
    $scope.getIdentifierSecondVar = function(){
        return $scope.identifierList[1].title;
    };

    //$scope.isTestNameInput = false;
    ////$scope.isStudyIdentifierInput= false;
    //$scope.reverseTestNameInput =function(){
    //    $scope.isTestNameInput = !$scope.isTestNameInput;
    //}
    //$scope.setTestNameInput= function(input){
    //    $scope.isTestNameInput = input;
    //}
    //$scope.showSubmitButton = function(){
    //    return $scope.isTestNameInput;
    //}
    //$scope.submitData = function(){
    //    return {
    //        "testNumber":$scope.testCount,
    //        "identiferList":$scope.identifierList,
    //        "testsList":$scope.testsList
    //    }
    //};
    //titles of uploade data file
    $scope.uploadVariables = [
        { 'title': "patient_code", 'drag': true },
        { 'title': "systolic_blood_pressure", 'drag': true },
        { 'title': "diastolic_blood_pressure", 'drag': true },
        { 'title': "heart_rate", 'drag': true },
        { 'title': "respiratory_rate", 'drag': true },
        { 'title': "visit_date", 'drag': true }//,
        //{ 'title': "TEST", 'drag': true },
        //{ 'title': "TE*@#$%ST", 'drag': true }
    ];
    //STATIC PREDEIFNED user upload data
    $scope.uploadVariablesDetails=[

            {"patient_code":"01-001","systolic_blood_pressure":"182","diastolic_blood_pressure":"112","heart_rate":"96", "respiratory_rate":"10","visit_date":"1"},
            {"patient_code":"01-002","systolic_blood_pressure":"112","diastolic_blood_pressure":"81","heart_rate":"38", "respiratory_rate":"11","visit_date":"2"},
            {"patient_code":"01-003","systolic_blood_pressure":"127","diastolic_blood_pressure":"74","heart_rate":"68", "respiratory_rate":"12","visit_date":"3"},
            {"patient_code":"13-001","systolic_blood_pressure":"100","diastolic_blood_pressure":"65","heart_rate":"76", "respiratory_rate":"13","visit_date":"4"},
            {"patient_code":"11-001","systolic_blood_pressure":"134","diastolic_blood_pressure":"77","heart_rate":"60", "respiratory_rate":"14","visit_date":"5"},
            {"patient_code":"01-002","systolic_blood_pressure":"135","diastolic_blood_pressure":"77","heart_rate":"68", "respiratory_rate":"15","visit_date":"6"},
            {"patient_code":"01-004","systolic_blood_pressure":"128","diastolic_blood_pressure":"87","heart_rate":"62", "respiratory_rate":"16","visit_date":"7"},
            {"patient_code":"01-005","systolic_blood_pressure":"125","diastolic_blood_pressure":"80","heart_rate":"65", "respiratory_rate":"17","visit_date":"8"},
            {"patient_code":"11-003","systolic_blood_pressure":"132","diastolic_blood_pressure":"80","heart_rate":"76", "respiratory_rate":"18","visit_date":"9"},
            {"patient_code":"01-006","systolic_blood_pressure":"132","diastolic_blood_pressure":"87","heart_rate":"80", "respiratory_rate":"19","visit_date":"10"},
    ];

    //Droppable variables in identifiers and observation variables.
    $scope.FindingStandardData = {
        "identifiers":[
            //{"name":"STUDYID",
            //    "label":"Study Identifier"
            //},
            {"name":"USUBJID",
                "label":"Unique Subject Identifier"},
            {"name":"SEQ",
                "label":"Sequence Number"}
        ],

        "obsVariables":[
            //{"name":"TESTCD",
            //    "label":"Test Short Name"},
            //{"name":"TEST",
            //    "label":"Test"},
            {"name":"ORRES",
                "label":"Test Result"}
            //{"name":"ORRESU",
            //    "label":"Test Result Unit"}
        ]
    };

    //$scope.InterventionStandardData={
    //    "identifiers":[
    //        {"name":"USUBJID",
    //            "label":"Unique Subject Identifier"},
    //        {"name":"SEQ",
    //            "label":"Sequence Number"}
    //    ]
    //}

    angular.forEach($scope.FindingStandardData.obsVariables, function(val, key) {
        $scope.identifierList.push({});
    });
    angular.forEach($scope.FindingStandardData.obsVariables, function(val, key) {
        $scope.testsList[$scope.testCount-1].push({});
    });

});

//HelpMenu controller to show descriptions of all domains
mapperApp.controller('helpMenuController',function($scope){
    $scope.details={
        "Findings":[
            {"DomainName":"DA", "DomainDescription":"Drug Accountability. Data regarding the accountability of study drug, such as information on the receipt, dispensing, return, and packaging."},
            {"DomainName":"DD", "DomainDescription":"Death Details. The domain is designed to hold supplemental data that are typically collected when a death occurs, such as the official cause of death. It does not replace existing data such as the SAE details in AE. Furthermore, it does not introduce a new requirement to collect information that is not already indicated as Good Clinical Practice or defined in regulatory guidelines. Instead, it provides a consistent place within SDTM to hold information that previously did not have a clearly defined home." },
            {"DomainName":"EG", "DomainDescription":"Electrocardiogram Results. Findings related to the collection of ECG data, including position of the subject, method of evaluation, all cycle measurements and all findings from the ECG including an overall interpretation if collected or derived."},
            {"DomainName":"IE", "DomainDescription":"Inclusion/Exclusion Criteria Not Met. The intent of the domain model is to only collect those criteria that cause the subject to be in violation of the inclusion/exclusion criteria not a response to each criterion." },
            {"DomainName":"IS", "DomainDescription":"The Immunogenicity Specimen Assessments (IS). It is intended to be used only for data collected regarding the immunogenic potential of materials under study." },
            {"DomainName":"LB", "DomainDescription":"Laboratory Test Findings. Laboratory test findings including, but is not limited to hematology, clinical chemistry and urinalysis data. This domain does not include microbiology or pharmacokinetic data, which are stored in separate domains." },
            {"DomainName":"MB and MS", "DomainDescription":"Microbiology. MB - Microbiology specimen findings, including gram stain results, and organisms found. MS - This includes microbiology susceptibility test results, plus results of any other organism-related tests." },
            {"DomainName":"MI", "DomainDescription":"Microscopic Findings. Microbiology specimen findings, including gram stain results, and organisms found." },
            {"DomainName":"MO", "DomainDescription":"Morphology. Macroscopic results (e.g. size, shape, color, and abnormalities of body parts or specimens) that are seen by the naked eye or observed via procedures such as imaging modalities, endoscopy, or other technologies. Many morphology results are obtained from a procedure, although information about the procedure may or may not be collected." },
            {"DomainName":"PC and PP", "DomainDescription":"Pharmacokinetics. PC - Concentrations of drugs/metabolites in fluids or tissues as a function of time. PP - Pharmacokinetic parameters derived from pharmacokinetic concentration-time (PC) data."  },
            {"DomainName":"PE", "DomainDescription":"Physical Exam. Findings collected during a physical examination of the subject. It has findings that are discovered that are related to body systems. Does not include vital signs measurements, which are stored in the vital signs domain." },
            {"DomainName":"QS", "DomainDescription":"Questionnaires. Questionnaires are named, stand-alone instruments designed to provide an assessment of a concept. Questionnaires have a defined standard structure, format, and content; consist of conceptually related items that are typically scored; and have documented methods for administration and analysis." },
            {"DomainName":"RP", "DomainDescription":"Reproductive System Findings. The Reproductive System Findings domain captures all Reproductive information related to a subject." },
            {"DomainName":"SC", "DomainDescription":"Subject Characteristics. The subject characteristics domain is for data not collected in other domains that is subject-related." },
            {"DomainName":"SS", "DomainDescription":"Subject Status. Subject Status is for data relating to general subject characteristics that are evaluated periodically to determine if they have changed." },
            {"DomainName":"TU TR and SR", "DomainDescription":"Oncology Domains TU, TR, and RS. Assessment of the change in tumor burden is an important feature of the clinical evaluation of cancer therapeutics: both tumor shrinkage (objective response) and disease progression are useful endpoints in cancer clinical trials.The tumor package consists of three SDTM domains based on the SDTM Findings Observation Class. The three domains are related but each has a distinct purpose." },
            {"DomainName":"TU", "DomainDescription":"The Tumor Identification (TU) - domain represents data that uniquely identifies tumors. The tumors are identified by an investigator and/or independent assessor and classified according to the disease assessment criteria." },
            {"DomainName":"TR", "DomainDescription":"The Tumor Response (TR) - represents quantitative measurements and/or qualitative assessments of the tumors identified in the TU domain. These measurements are usually taken at baseline and then at each subsequent assessment to support response evaluations." },
            {"DomainName":"SR", "DomainDescription":"The Disease Response (SR) - domain represents the response evaluation(s) determined from the data in TR. Data from other sources (in other SDTM domains) might also be used in an assessment of response." },
            {"DomainName":"VS",   "DomainDescription":"Vital Signs. Measurements including but not limited to blood pressure, temperature, respiration, body surface area, BMI, height and weight."}
        ],

        "Interventions":[
            {"DomainName":"CM", "DomainDescription":"Concomitant and Prior Medications. Case report form (CRF) data that captures the Concomitant and Prior Medications/Therapies used by the subject. Examples are the Concomitant Medications/Therapies given on an as needed basis and the usual Background Medications/Therapies given for a condition." },
            {"DomainName":"EX", "DomainDescription":"Exposure Domains. Exposure (EX) - The Exposure domain model records the details of a subject's exposure to protocol-specified study treatment. Study treatment may be any intervention that is prospectively defined as a test material within a study, and is typically but not always supplied to the subject." },
            {"DomainName":"EC", "DomainDescription":"Exposure Domains. Exposure as Collected (EC). The Exposure as Collected domain model reflects protocol-specified study treatment administrations, as collected." },
            {"DomainName":"PR", "DomainDescription":"Procedures. The Procedures domain model reflects collected details describing a subject’s therapeutic and diagnostic procedures." },
            {"DomainName":"SU", "DomainDescription":"Substance Use. The intent of the domain is to capture substance use information that may be used to assess the efficacy and/or safety of therapies that look to mitigate the effects of chronic substance use." }
        ],

        "Events":[
            {"DomainName":"AE", "DomainDescription":"Adverse Events. Adverse events may be captured either as free text or a pre-specified list of terms." },
            {"DomainName":"CE", "DomainDescription":"Clinical Events. A dataset used to capture clinical events of interest that would not be classified as adverse events." },
            {"DomainName":"DS", "DomainDescription":"Disposition. A subject domain utilized for the submission of information encompassing and representing data, vocabulary or records related to disposition." },
            {"DomainName":"DV", "DomainDescription":"Protocol Deviations. The intent of the domain is to capture protocol violations and deviations during the course of the study and will store only those criteria violation by or deviated from by the subject and not a response to each violation or deviation." },
            {"DomainName":"HO", "DomainDescription":"Healthcare Encounters. The Healthcare Encounters dataset includes inpatient and outpatient healthcare events (e.g., hospitalizations, nursing home stay, rehabilitation facility stays, ambulatory surgery)." },
            {"DomainName":"MH", "DomainDescription":"Medical History. The medical history dataset includes the subject's prior history at the start of the trial. Examples of subject medical history information could include general medical history, gynecological history, and primary diagnosis." }
        ]
    };
    //get the example photo file of a selected domain
    $scope.getPhotoName = function(){
        return $scope.photoName;
    }
});

//mapperApp.controller('mappingFormSelectionController',function($scope){
//    //$scope.selectedRow=null;
//
//    $scope.mappingStandardsData = {
//        "indentifiers":[
//            {"name":"STUDYID",
//             "label":"Study Identifier"
//            },
//            {"name":"USUBJID",
//             "lable":"Unique Subject Identifier"}
//        ],
//        "obsVariables":[
//            {"name":"TESTCD",
//             "label":"Test Short Name"},
//            {"name":"TEST",
//                "label":"Test"},
//            {"name":"ORRES",
//                "label":"Test Result"},
//            {"name":"ORRESU",
//                "label":"Test Result Unit"}
//        ]
//    }
//$scope.Identifers=[
//    {variableName:"Study Identifier (STUDYID)*:", mappingVar: '< input type="text" class="form-control">' },
//    {variableName:"Domain Abbreviation (DOMAIN)*", mappingVar:'VS'},
//    {variableName:'Unique Subject Identifier (USUBJID)*:', mappingVar:'MappingForm'},
//    {variableName:'Unique Subject Identifier (USUBJID)*:', mappingVar:'MappingForm'},
//
//];

//$scope.topic=[
//    {variableName:'Vital Signs Test Short Name (VSTESTCD)*:', mappingVar:'VSTESTCD' }
//];

//$scope.setClickedRow= function(index){
//    $scope.selectedRow = index;
//};
//
//$scope.removeItem = function removeItem(row) {
//    var index = $scope.Identifers.indexOf(row);
//    if (index !== -1) {
//        $scope.Identifers.splice(index, 1);
//    }
//};
//});



//mapperApp.controller ('addTestController',function($scope){
//    $scope.testCount=0;
//});

//mapperApp.directive("addtestsbutton", function(){
//
//    return {
//        restrict: "E",
//        template: "<button addtests class=\"btn btn-md btn-success \">Add New Test</button>"
//    }
//});
//mapperApp.directive("addtests", function($compile){
//    return function(scope, element, attrs){
//        element.bind("click", function(){
//            scope.testCount++;
//            angular.element(
//                document.getElementById('space-for-newTest')).append(
//                $compile("<div><h4>Test"+scope.testCount+"</h4> <table class=\"table table-bordered \"> <tr> <td class=\"variableNameTd\">Vital Sins Test Name(VSTEST)*: </td> <td><input type=\"text\" class=\"form-control\"></td> </tr> <tr> <td class=\"variableNameTd\">Result or Finding in Original Units (VSORRES)*:</td> <td>Mapping Variable</td> </tr> <tr> <td class=\"variableNameTd\">Original Units (VSORRESU)*:</td> <td><input type=\"text\" class=\"form-control\"></td> </tr> </table></div>")(scope));
//
//            //<table class="table table-bordered ">
//            //    <tr>
//            //    <td class="variableNameTd">Vital Sins Test Name(VSTEST)*: </td>
//            //<td><input type="text" class="form-control"></td>
//            //    </tr>
//            //    <tr>
//            //    <td class="variableNameTd">Result or Finding in Original Units (VSORRES)*:</td>
//            //<td>Mapping Variable</td>
//            //</tr>
//            //<tr>
//            //<td class="variableNameTd">Original Units (VSORRESU)*:</td>
//            //<td><input type="text" class="form-control"></td>
//            //    </tr>
//            //    </table>
//
//        });
//    };
//});


//
//mapperApp.controller('czUserUploadsController', function($scope){
//
//    $scope.userUplaodVariables =[
//        {selected:false, label:'patient_code'},
//        {selected:false, label: 'systolic_blood_pressure'},
//        {selected:false, label:'diastolic_blood_pressure'},
//        {selected:false, label:'heart_rate'},
//        {selected:false, label:'respiratory_rate'},
//        {selected:false, label:'visit_date'}
//    ];
//    //$scope.selectedRow=null;
//    //$scope.setClickedRow = function(index){
//    //    $scope.selectedRow = index;
//    //};
//});