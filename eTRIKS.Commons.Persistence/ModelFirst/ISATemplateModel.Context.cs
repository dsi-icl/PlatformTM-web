﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class ISATemplate_schemaEntities : DbContext
    {
        public ISATemplate_schemaEntities()
            : base("name=ISATemplate_schemaEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Domain_Dataset_Template_TAB> Domain_Dataset_Template_TAB { get; set; }
        public virtual DbSet<Domain_Variable_Template_TAB> Domain_Variable_Template_TAB { get; set; }
    }
}
