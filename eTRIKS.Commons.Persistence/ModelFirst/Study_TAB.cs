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
    
    public partial class Study_TAB
    {
        public Study_TAB()
        {
            this.Activity_TAB = new HashSet<Activity_TAB>();
        }
    
        public string OID { get; set; }
        public string name { get; set; }
        public string description { get; set; }
    
        public virtual ICollection<Activity_TAB> Activity_TAB { get; set; }
    }
}
