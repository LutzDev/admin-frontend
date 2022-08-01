<Table button-text="Upload intervention" :header="['Created', 'Name']">
    <template #modal>
      <div class="space-y-8">
        <p>
          Hier können Interventionen hochgeladen und benannt werden.
        </p>
        <!-- <UploadIntervention placeholder="Intervention name input" :text-limit="20" action="http://127.0.0.1:5040/transform/upload" :limit="1" file-type="json" select-button="Select intervention" upload-button="Upload intervention" /> -->
        <UploadIntervention />
      </div>
    </template>
  </Table>
