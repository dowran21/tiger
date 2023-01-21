select * from LG_001_01_ORFLINE --Sargyt fakturanyn ici LG_FirmaCode_period_ORFLINE 
Period need to be taken from L_CAPIPERIOD 
FirmaCode need to be taken from L_CAPIFIRM 
SELECT * FROM [rustem].[dbo].[LG_001_ITEMS] -- here is items LG_FirmCode_Items
select * from LG_001_01_ORFICHE --Sargyt fakturanyn gaby
select * from LG_001_ITEMS  --Haryt
select * from LG_001_UNITSETL --Haryt Birligi
seleçt * from L_CAPIWHOUSE -- Skladlaryn sanawy firmasy bilen bile
select * from LG_001_CLCARD --Kliyent
select * from LG_001_KSCARD -- bank atlary
select SUM (DEBIT-CREDIT)  from LG_001_01_CSHTOTS where cardref=2 and TOTTYPE=1 --3-nji kassanyn galyndysy
select * from L_CAPIFIRM -- firmalaryn duryan yeri
select * from L_CAPIPERIOD -- firmalara degisli dowurlerin duryan yeri
select * from LG_001_BNCARD -- Bankyn ady
select * from LG_001_BANKACC --bankdaky H/H ady
select * from LG_SLSMAN -- sales manager
select SUM (DEBIT-CREDIT) from LG_001_01_BNTOTFIL where cardref=1 and TOTTYP=1 --bankyn galyndysy
SELECT GNTOTS