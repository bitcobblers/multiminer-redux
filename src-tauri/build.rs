use tauri_build::WindowsAttributes;

#[cfg(debug_assertions)]
fn get_windows_attributes() -> WindowsAttributes {
    tauri_build::WindowsAttributes::new()
}

#[cfg(not(debug_assertions))]
fn get_windows_attributes() -> WindowsAttributes {
    tauri_build::WindowsAttributes::new().app_manifest(
        r#"
<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
  <dependency>
    <dependentAssembly>
      <assemblyIdentity
        type="win32"
        name="Microsoft.Windows.Common-Controls"
        version="6.0.0.0"
        processorArchitecture="*"
        publicKeyToken="6595b64144ccf1df"
        language="*"
      />
    </dependentAssembly>
  </dependency>
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v3">
    <security>
        <requestedPrivileges>
            <requestedExecutionLevel level="requireAdministrator" uiAccess="false" />
        </requestedPrivileges>
    </security>
  </trustInfo>
</assembly>
"#,
    )
}

fn main() {
    let attributes = get_windows_attributes();

    tauri_build::try_build(tauri_build::Attributes::new().windows_attributes(attributes))
        .expect("error while building with tauri");
}
