Extended Dropdown Widget
=============================

Overview
--------
This widget wraps the "Select2" javascript library (select2.org) to enable some of the features it provides, such as searching, loading of large data sets, and multiple selection.

Installation
------------
This widget uses the version 3.5.3 of "Select2". The files needed are contained under the folder "allLibs". If this library (in the mentioned version) is already available in your environment, you would not need to copy these files again. Both provided folders, "extendedDropdownWidget" and "allLibs", need to be copied/unpacked into "<MASHZONE_NG_ROOT>/apache-tomcat/webapps/mashzone/hub/dashboard/widgets/customWidgets". After that, you will need to restart the server.
For further infos, please refer to the MashZone NextGen documentation on how to install a custom widget.

Usage
-----
The widget can be used in the same way as other widgets. Once the widget is included in a dashboard, you will be able to:
+ Assign a label column ("Visible column") in the "Assign data" dialog.
+ Assign a key column ("Key column") in the "Assign data" dialog. If no key column is configured, the label column will be used both as key and label.
+ Assign other columns ("More columns") that will not be visible, but that can be used as well for filtering and/or selection events.
+ Sort the displayed values by one of the columns configured in the "Assign data" dialog. By default, values will be sorted in ascending direction.
+ If no value has been selected, the dropdown will show an empty value or the value provided using the "No selection label" property.

When the dashboard is opened in preview mode, the dropdown loads only an initial amount of options (20 by default). When the dropdown is opened, you can either enter some text in the search field to reduce the amount of fields shown by the dropdown, and/or scroll down to view more options.

Multiple selection is not yet fully supported by this custom widget.

This widget is compatible with Software AG MashZone NextGen v10.2.

------------------------------------------------------------------------

These tools are provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.

------------------------------------------------------------------------

Contact us at [TECHcommunity](mailto:technologycommunity@softwareag.com?subject=Github/SoftwareAG) if you have any questions.