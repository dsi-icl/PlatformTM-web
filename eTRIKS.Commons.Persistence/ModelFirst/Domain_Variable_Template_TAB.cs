//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace eTRIKS.Commons.Persistence.ModelFirst
{
    using System;
    using System.Collections.Generic;
    
    public partial class Domain_Variable_Template_TAB
    {
        public string OID { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string dataType { get; set; }
        public string datasetId { get; set; }
        public string variableType { get; set; }
        public string role { get; set; }
    
        public virtual Domain_Dataset_Template_TAB Domain_Dataset_Template_TAB { get; set; }
    }
}
