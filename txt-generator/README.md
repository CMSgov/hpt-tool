TXT technical specifications and generator tool
===============================================

#### Background
As finalized in the CY2024 OPPS/ASC Final Rule, beginning January 1, 2024, each hospital must ensure that the public website it selects to host its machine-readable file (MRF) establishes and maintains, in the form and manner specified by CMS:
* A .txt file in the root folder that includes:
  * The hospital location name that corresponds to the MRF;
  * The source page URL that hosts the MRF;
  * A direct link to the MRF (the MRF URL); and
  * Hospital point of contact information.
* A link in the footer on its website, including but not limited to the homepage, that is labeled “Price Transparency” and links directly to the publicly available webpage that hosts the link to the MRF.

The purpose of these requirements is to facilitate automated access to hospital MRFs.

#### Steps:
1. Generate a TXT file that includes the required information indicated below. 
1. If the MRF contains standard charge information for more than one location, create an entry for each of the inpatient locations and standalone emergency hospitals in the TXT file.
1. Name the file “cms-hpt.txt”.
1. Place the TXT file on the root of the domain of the public website your hospital has selected to host its machine-readable file (MRF), without regard to page structure. As an example, a hospital with the website https://hospital.com would locate its file at https://hospital.com/cms-hpt.txt    


#### Required information for the TXT file:
| Attribute | Name | Description |
| ----- | ---- | ---- |
| location-name: [hospital location name] | Hospital Location Name | Indicate the hospital location name that corresponds to the standard charge information contained in the MRF. |
| source-page-url: [URL] | Source page URL | The source page URL is the URL of the public webpage you have selected to host the MRF.|
| mrf-url: [URL] | Machine-readable file URL | Indicate the URL of the MRF. |
| contact-name: [name] | POC Name | Indicate the name of a point of contact (POC) that is capable of answering technical questions about your hospital’s MRF and the data contained in it. |
| contact-email: [email] | Contact email | Indicate the email address of the POC you have designated to answer technical questions about your hospital’s MRF and the data contained in it. |


#### Example TXT File
```
location-name: Test Hospital
source-page-url: https://example.com
mrf-url: https://example.com/HPT
contact-name: Jon Snow
contact-email: jsnow@example.com

location-name: Test Hospital 2
source-page-url: https://example2.com
mrf-url: https://example2.com/HPT
contact-name: Jane Doe
contact-email: jdoe@example2.com
```
