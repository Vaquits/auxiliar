// ===========================================================================
// eXe
// Copyright 2018, CeDeC
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//===========================================================================
Ext.define('eXe.view.forms.ValidatePanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.validate',
    requires: [
        'eXe.view.forms.PackagePanel'
    ],
    fileIsSaved: false,
    exportType: null,
    shownProperties: [],

    onChange: function(me, newValue) {
        if (newValue === null) {
            me.setValue('');
        }
    },

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            autoScroll: true,
            trackResetOnLoad: true,
            url: location.pathname + "/properties",
            bodyPadding: 15,
            // Items
            items:[{
                xtype: 'label',
                text:  _('Some important information is missing in the \"Properties\" tab. You can complete it now.'),
                anchor: '100%',
                style: 'padding:0 0 10px 0;display:block'
            }],
            bbar: {
                layout: 'auto',
                items:{
                    xtype: 'container',
                    defaultType: 'button',
                    items: [{
                        xtype: 'button',
                        text: _('Save and export'),
                        handler: function (button) {
                            var formpanel = button.up('form');
                            var form = formpanel.getForm();

                            form.submit({
                                success: function () {
                                    if (formpanel.fileIsSaved) {
                                        eXe.app.getController('Toolbar').fileSave('',formpanel.exportType);
                                    }

                                    // Reload the tab to see saved changes
                                    var mainPanel = eXe.app.getController('MainTab');
                                    var activeTab = mainPanel.getMaintab().getActiveTab();
                                    // Search for the deepest active tab
                                    while (activeTab.getActiveTab) {
                                        activeTab = activeTab.getActiveTab();
                                    }

                                    if (activeTab.xtype != 'uxiframe') {
                                        mainPanel.loadForm(activeTab);
                                    }

                                    // Do the validation again
                                    nevow_clientToServerEvent('validatePackageProperties', formpanel.up('window'), '', formpanel.exportType)
                                    formpanel.up('window').close();
                                },
                                failure: function (form, action) {
                                    Ext.Msg.alert(_('Error'), action.result.errorMessage);
                                    form.up('window').close();
                                }
                            });
                        },
                        margin: 10,
                        style: 'float:right'
                    },
                    {
                        xtype: 'button',
                        text: _('Export without changes'),
                        handler: function (button) {
                            var formpanel = button.up('form');
                            eXe.app.getController('Toolbar').exportPackage(formpanel.exportType, '');
                            formpanel.up('window').close();
                        },
                        margin: 10
                    },
                    {
                        text: _('Cancel'),
                        handler: function () { this.up('window').close(); }
                    }]
                }
            }

        });

        // Include the same items added for the Package panel
        var panel = Ext.ComponentQuery.query('panel#package_properties')[0];

        for (var i = 0; i < this.shownProperties.length; i++) {
            var prop = this.shownProperties[i];
            prop = prop.split('|');

            var field = panel.getForm().findField(prop[0]);
            var clonedField = field.cloneConfig();

            // If there is a list of allowed values, don't show the wrong values
            if (prop.length >= 3) {
                // If the problem is the value, explain to the user that they should select another
                if (prop[1] == 'value') {
                    this.items.push({
                        xtype: 'label',
                        text:  _('The value selected for this field is not accepted by Procomún. Please select one of the values below:'),
                        anchor: '100%'
                    });
                }

                if (clonedField.xtype == 'combobox') {
                    var allowed_values = prop[2].split(';');

                    clonedField.store.filter({
                        filterFn: function (record) {
                            return (typeof(record) === 'undefined' || Ext.Array.indexOf(allowed_values, record.get('field1')) != -1);
                        }
                    });
                }
            }

            // We need to change the inputId in order to get the right value when submitting the form
            clonedField.inputId = clonedField.inputId + '-validate';
            this.items.push(clonedField);
        }

        // For Procomún, we need an additional sentence to help people experimenting problems
        if (this.exportType == 'procomun'){
            this.items.push({
                xtype: 'label',
                text:  _('If you have problems publishing or you want to complete your cataloguing later, close this dialogue, export as SCORM 2004 and upload the generated zip file to Procomún.'),
                anchor: '100%',
                style: 'padding:5px 0 0;display:block'
            });
        }

        me.callParent(arguments);
    }

});
