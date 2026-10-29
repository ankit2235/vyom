import type { OfficialAlert } from './types';

/**
 * Official alerts read by hand from the CDSCO alerts listing. Rows are
 * transcribed from the original PDFs; addresses are shortened to the town.
 * This is a historical dataset: nothing here is fetched or updated live.
 */

const listingUrl = 'https://cdsco.gov.in/opencms/opencms/en/Notifications/Alerts/';
const authority = 'Central Drugs Standard Control Organisation (CDSCO)';

const spuriousReply =
  'The actual manufacturer (as per label claim) has informed that the impugned batch of the product has not been manufactured by them and that it is a spurious drug.';
const spuriousRemark =
  'The product is purported to be spurious, however, the same is subject to outcome of investigation.';

export const alerts = [
  {
    id: 'cdsco-spurious-2025-06',
    title: 'List of spurious Drugs for the month of June-2025',
    authority,
    kind: 'spurious',
    publishedOn: '2025-07-18',
    documentUrl:
      'https://cdsco.gov.in/opencms/resources/UploadCDSCOWeb/2018/UploadAlertsFiles/List%20of%20spurious%20Drugs%20June-2025.pdf',
    listingUrl,
    retrievedOn: '2026-10-27',
    totalRows: 4,
    rows: [
      {
        sNo: 1,
        product: 'Cefixime Tablets IP (TAXIM-O 200 TABLETS)',
        batch: '24460967',
        manufactured: 'Jul-2024',
        expiry: 'Jun-2026',
        manufacturer: 'Under Investigation',
        reason: 'Identification and Assay of Cefixime Trihydrate',
        reportedBy: 'Drugs Inspector, Bihar',
      },
      {
        sNo: 2,
        product: 'Ointment of Heparin Sodium and Benzyl Nicotinate (THROMBOPHOB)',
        batch: 'I404138',
        manufactured: 'Aug-2024',
        expiry: 'Jul-2027',
        manufacturer: 'Under Investigation',
        reason: 'Identification and Assay of Heparin Sodium',
        reportedBy: 'Drugs Inspector, New Delhi',
      },
      {
        sNo: 3,
        product: 'Rosuvas F 10 Tablets (Rosuvastatin and Fenofibrate Tablets IP)',
        batch: 'SIF2676A',
        manufactured: '12-2024',
        expiry: '05-2027',
        manufacturer: 'Under Investigation',
        reason: 'Description and Assay of Fenofibrate',
        reportedBy: 'Drugs Inspector, Telangana',
      },
      {
        sNo: 4,
        product: 'Rosuvas F 20 Tablets (Rosuvastatin and Fenofibrate Tablets IP)',
        batch: 'SIF2736A',
        manufactured: '12-2024',
        expiry: '05-2027',
        manufacturer: 'Under Investigation',
        reason: 'Assay of Fenofibrate',
        reportedBy: 'Drugs Inspector, Telangana',
      },
    ],
    action: `Listed on the CDSCO portal to make stakeholders aware of the batches. Remarks for every row: “${spuriousRemark}”`,
    rowNote: `Firm’s reply for every row: “${spuriousReply}”`,
  },
  {
    id: 'cdsco-spurious-2025-05',
    title: 'List of Drugs, Medical Devices, Vaccine and Cosmetics declared as Spurious for the Month of May-2025',
    authority,
    kind: 'spurious',
    publishedOn: '2025-06-20',
    documentUrl:
      'https://cdsco.gov.in/opencms/resources/UploadCDSCOWeb/2018/UploadAlertsFiles/md%20Vaccine%20and%20Cosmetics%20declared%20as%20Spurious%20for%20the%20Month%20of%20May-2025.pdf',
    listingUrl,
    retrievedOn: '2026-10-27',
    totalRows: 2,
    rows: [
      {
        sNo: 1,
        product: 'Telmisartan Tablets I.P. 40mg (Telma 40)',
        batch: '05240226',
        manufactured: 'Feb-2024',
        expiry: 'Jan-2027',
        manufacturer: 'Under Investigation',
        reason: 'Dissolution',
        reportedBy: 'Drugs Inspector, Bihar',
      },
      {
        sNo: 2,
        product: 'Telmisartan Tablets IP 40mg (Telma 40)',
        batch: 'K18230707',
        manufactured: 'Jun-2024',
        expiry: 'May-2027',
        manufacturer: 'Under Investigation',
        reason: 'Identification and Assay of Telmisartan',
        reportedBy: 'Drugs Inspector, Bihar',
      },
    ],
    action: `Listed on the CDSCO portal to make stakeholders aware of the batches. Remarks for every row: “${spuriousRemark}”`,
    rowNote: `Firm’s reply for every row: “${spuriousReply}”`,
  },
  {
    id: 'cdsco-nsq-2025-06',
    title: 'CDSCO NSQ ALERT FOR THE MONTH OF June 2025',
    authority,
    kind: 'nsq',
    publishedOn: '2025-07-18',
    documentUrl:
      'https://cdsco.gov.in/opencms/resources/UploadCDSCOWeb/2018/UploadAlertsFiles/CDSCO%20NSQ%20june25.pdf',
    listingUrl,
    retrievedOn: '2026-10-27',
    totalRows: 55,
    excerpt:
      'Excerpt: rows 1–6 and 29 of 55. Rows 1–6 are the first rows of the list and include an oxytocin injection; row 29 names a manufacturer that also appears in the Rajasthan oxytocin case. The full list is in the original document.',
    rows: [
      {
        sNo: 1,
        product: 'Dextrose Injection I.P. 5%w/v (D5)',
        batch: '1-3098',
        manufactured: '01/2025',
        expiry: '12/2027',
        manufacturer: 'M/s. Tam-Bran Pharmaceuticals Pvt. Ltd., Pithampur (M.P.)',
        reason: 'Assay of Dextrose (Anhydrous)',
        reportedBy: 'CDL, Kolkata',
      },
      {
        sNo: 2,
        product: 'Dexamethasone Sodium Phosphate Injection I.P. (Dexacos)',
        batch: 'P24L220',
        manufactured: '12/2024',
        expiry: '11/2026',
        manufacturer: 'M/s. Paksons pharmaceuticals Private Limited, Bahadurgarh, Haryana',
        reason: 'Free Dexamethasone, Particulate matter and Description',
        reportedBy: 'CDL, Kolkata',
      },
      {
        sNo: 3,
        product: 'Methylcobalamin Injection',
        batch: 'S4H046',
        manufactured: '08/2024',
        expiry: '01/2026',
        manufacturer: 'M/s. Arion Healthcare, Baddi (H.P.)',
        reason: 'Assay of Methylcobalamin, Particulate matter and Description',
        reportedBy: 'CDL, Kolkata',
      },
      {
        sNo: 4,
        product: 'Tranexamic Acid Injection IP 500 mg/5ml',
        batch: 'Z24-185',
        manufactured: '02/2024',
        expiry: '01/2026',
        manufacturer: 'M/s. Zee Laboratories Ltd., Paonta Sahib',
        reason: 'Related Substances and Assay of Tranexamic Acid',
        reportedBy: 'CDL, Kolkata',
      },
      {
        sNo: 5,
        product: 'Oxytocin Injection I.P. 1ml',
        batch: 'AOX-2402',
        manufactured: '04/2024',
        expiry: '03/2026',
        manufacturer: 'M/s. Systochem Laboratories Ltd., Loni (U.P.)',
        reason: 'Assay of Oxytocin',
        reportedBy: 'CDL, Kolkata',
      },
      {
        sNo: 6,
        product: 'Calcium Aspartate, Calcium Orotate, Calcitriol Minerals And Vitamin Tablets',
        batch: 'EZF-2107',
        manufactured: '11/2024',
        expiry: '04/2027',
        manufacturer: 'M/s. Overseas Health Care Pvt. Ltd., Phillaur (Pb.)',
        reason: 'Assay of Calcitriol, Zinc, Magnesium Hydroxide and Folic Acid',
        reportedBy: 'CDL, Kolkata',
      },
      {
        sNo: 29,
        product: 'Sitagliptin & Metformin Tablets 50mg + 1000mg (Sitajack-M)',
        batch: 'T-2672',
        manufactured: '09/2024',
        expiry: '08/2026',
        manufacturer: 'M/s. Jackson Laboratories Pvt.Ltd., Amritsar',
        reason: 'Assay of Sitagliptin',
        reportedBy: 'CDL, Kolkata',
      },
    ],
    action:
      'Listed on the CDSCO portal “to make stakeholders aware about the NSQ batches identified in the market”. No other action is described in the document.',
  },
] as const satisfies readonly OfficialAlert[];

export function getAlert(id: string): OfficialAlert | undefined {
  return alerts.find((alert) => alert.id === id);
}
