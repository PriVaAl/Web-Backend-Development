-- Task 1: Insert Tony Stark
INSERT INTO public.account (
account_firstname,
account_lastname,
account_email,
account_password
)
VALUES (
'Tony',
'Stark',
'tony@starkent.com',
'Iam1ronM@n'
);

-- Task 2: UPDATE the Tony Stark record to change the account_type to "Admin"
UPDATE public.account
SET account_type= 'Admin'
WHERE account_email = 'tony@starkent.com';

--Task 3: Delete the Tony Stark record from the database.
DELETE from public.account
WHERE account_email ='tony@starkent.com'; 

--Task 4: Update the GM Hummer description using REPLACE. 
UPDATE public.inventory
SET inv_description = REPLACE (inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'
and inv_model = 'Hummer';

--Tas 5: INNER JOIN to show Sport vehicles.
SELECT inv_make, inv_model, classification_name
FROM public.inventory
INNER JOIN public.classification
ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport'; 

--Task 6: Update image paths to include /vehicles
UPDATE public.inventory
SET
inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail,'/images/','/images/vehicles/');
