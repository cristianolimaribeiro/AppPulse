SET client_encoding = 'UTF8';

UPDATE ap_incidents 
SET description = 'O sistema retornou erro 500 nas últimas verificações.' 
WHERE id = 1;

UPDATE ap_status_history 
SET reason = 'Primeira verificação bem sucedida' 
WHERE reason LIKE 'Primeira%';

UPDATE ap_status_history 
SET reason = 'Retornou 500 Internal Server Error' 
WHERE reason LIKE 'Retornou 500%';