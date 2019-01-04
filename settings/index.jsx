function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">HPE OneSphere Settings</Text>}>
         <TextInput
           title="Add HPE OneSphere URL"
           label="OneSphere URL"
           settingsKey="onesphereUrl"
           placeholder="my-instance.hpeonesphere.com"
           action="Add URL"
        />
        { props.settings.onesphereUrl && JSON.parse(props.settings.onesphereUrl).name && JSON.parse(props.settings.onesphereUrl).name.indexOf('.hpeonesphere.com') === -1 &&
          <Text style={{ color: 'red' }}>A valid HPE OneSphere URL is required.</Text>
        }
        <TextInput
           title="Add Username"
           label="Username"
           settingsKey="username"
           placeholder="username"
           action="Add Username"
        />
        <TextInput
           type="password"
           title="Add password"
           label="Password"
           settingsKey="password"
           action="Add Password"
           renderItem={(OneSphere) => <Text>OneSphere {Onesphere.toString()}</Text>}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
