export default function TestPublicForm() {
  // Log inmediato
  console.log('✅✅✅ TestPublicForm SE ESTÁ RENDERIZANDO! ✅✅✅');
  
  // Test de error boundary
  try {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '40px auto',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          padding: '40px'
        }}>
          <h1 style={{ 
            fontSize: '36px', 
            marginBottom: '20px',
            color: '#ec4899'
          }}>
            🎂 ¡FORMULARIO FUNCIONANDO! 🎂
          </h1>
          
          <div style={{
            background: '#dcfce7',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <p style={{ fontSize: '18px', color: '#15803d', fontWeight: 'bold' }}>
              ✅ ¡ÉXITO! El routing está funcionando correctamente
            </p>
            <ul style={{ marginTop: '10px', color: '#166534' }}>
              <li>✓ La ruta hash está activa</li>
              <li>✓ El componente se está renderizando</li>
              <li>✓ React está funcionando</li>
              <li>✓ Todo el sistema está operativo</li>
            </ul>
          </div>

          <div style={{
            background: '#f3f4f6',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
              <strong>Hash actual:</strong> <code style={{ 
                background: '#e5e7eb', 
                padding: '2px 8px', 
                borderRadius: '4px',
                fontSize: '13px'
              }}>{window.location.hash || '(vacío)'}</code>
            </p>
            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
              <strong>URL completa:</strong> <code style={{ 
                background: '#e5e7eb', 
                padding: '2px 8px', 
                borderRadius: '4px',
                fontSize: '11px',
                wordBreak: 'break-all'
              }}>{window.location.href}</code>
            </p>
            <p style={{ fontSize: '14px', color: '#374151' }}>
              <strong>Timestamp:</strong> {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div style={{
            background: '#dbeafe',
            border: '1px solid #3b82f6',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <p style={{ fontSize: '16px', color: '#1e40af', marginBottom: '10px' }}>
              <strong>ℹ️ Información del Sistema:</strong>
            </p>
            <ul style={{ fontSize: '14px', color: '#1e3a8a', lineHeight: '1.8' }}>
              <li>• Usando <strong>Hash Routing</strong> (#/pedido)</li>
              <li>• No requiere configuración de servidor</li>
              <li>• Compatible con todos los navegadores</li>
              <li>• Componente: TestPublicForm.tsx</li>
            </ul>
          </div>

          <div style={{
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <p style={{ fontSize: '16px', color: '#92400e', marginBottom: '10px' }}>
              <strong>🚀 Próximos Pasos:</strong>
            </p>
            <ol style={{ fontSize: '14px', color: '#78350f', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>Confirmar que ves este mensaje correctamente</li>
              <li>Verificar la consola para logs adicionales</li>
              <li>Cambiar a PublicOrderForm.tsx (formulario completo)</li>
              <li>Probar el envío de pedidos</li>
            </ol>
          </div>

          <button
            onClick={() => {
              console.log('Botón clickeado - volviendo al dashboard');
              window.location.hash = '';
            }}
            style={{
              marginTop: '30px',
              width: '100%',
              padding: '15px',
              background: '#ec4899',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#db2777'}
            onMouseOut={(e) => e.currentTarget.style.background = '#ec4899'}
          >
            ← Volver al Dashboard
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ ERROR en TestPublicForm:', error);
    return (
      <div style={{ padding: '20px', background: 'red', color: 'white' }}>
        <h1>ERROR: {String(error)}</h1>
      </div>
    );
  }
}
