# backend

API Design

Base path: /api/v1

-  GET /api/v1/folders/tree

   Returns the full folder tree for the left panel on load.
   
   Response example:
   ```json
   [
     {
       "id": "root-id",
       "name": "Root",
       "children": [
         {
           "id": "sub-1",
           "name": "Documents",
           "children": [...]
         }
       ]
     }
   ]
   ```

- GET /api/v1/folders/:id/children

  Returns direct subfolders of the given folder.

  Response example:
   ```json
   [
     {
       "id": "id",
       "name": "Child Folder"
     }
   ]
   ```
