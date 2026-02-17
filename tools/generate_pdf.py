from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Spacer, Preformatted, Paragraph
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def md_to_pdf(md_path, pdf_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        text = f.read()

    doc = SimpleDocTemplate(pdf_path, pagesize=letter,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=72)
    styles = getSampleStyleSheet()
    title = Paragraph('API Documentation', styles['Title'])
    spacer = Spacer(1, 12)
    code_style = ParagraphStyle('Code', fontName='Courier', fontSize=9, leading=12)
    pre = Preformatted(text, code_style)
    elems = [title, spacer, pre]
    doc.build(elems)

if __name__ == '__main__':
    import sys
    md = sys.argv[1] if len(sys.argv) > 1 else '..\\API_DOCS.md'
    pdf = sys.argv[2] if len(sys.argv) > 2 else '..\\API_DOCS.pdf'
    md_to_pdf(md, pdf)
