Note: I eventually implemented this feature manually (not via AI), but keep this as documentation anyway.

Implement the following feature: permissibly show mappings in the list and automatically switch layout type and options when the mapping is selected.

Definition of "applicable mapping":
 - A LayoutMapping applies to a layout (with given options) if any of its defined mapping fields applies.
   This is implemented in the function "getSpecificMapping" on the RowBasedLayoutModel (file base-model.ts), which returns "undefined" if the LayoutMapping does not apply.
 - a "mapping30" applies to every layout with any options
 - a "mappingThumb30" applies to all Harmonic boards, ANSI with the "wide" option, and Ortho with the "split" option. (Not ANSI or Ortho without those options.) 
   + TODO: this part is not implemented yet, because all layouts have a workaround way to show a mappingThumb30. 
           It would be nice to automatically switch, though.
 - all other mappings apply only for exactly one layout type and options.

The current implementation of this feature is very minimal. To do better, we should augment the data model a bit, 
so that each FlexMapping has more explicit information about its preferred and supported layout options.
(Currently we only implement the "supported" part, not the "preferred".)

Relevant code: 
 * MappingArea.tsx function MappingList()
    - don't filter mappings, just show them all.
 * MappingArea.tsx function MappingListItem()
    - when the mapping is not applicable for the current layout options, calculate the mapping metrics using different (applicable!) options
    - when the mapping is applicable for the current layout type, don't show any metrics.
 * MappingArea.tsx function MappingListItem()
    - extract the onClick handler into a proper "setMapping()" function implementing the following logic
    - when a mapping is selected and layout options are not applicable, change them to be applicable.
    - when a mapping is selected which has no key map for the current layout at all, then switch to an applicable layout type. Also change options as needed.
 * app.tsx function setLayout()
    - probably shouldn't change