#!/usr/bin/python

import sys, re, os
import time
from subprocess import *
from operator import itemgetter, attrgetter

# Generic procedure class. 
class MJProcedure:
    def __init__(self, ProcTitle):
        self.ProcedureTitle = ProcTitle
        self.Procedure = ""
        self.PrimaryContact = ""
        self.Revision = ""
        self.Status = ""
        self.ApprovalDate = ""
        self.Task = ""
        self.FileOrigin = ""

# Find a specific entry in a procedure and find the corresponding content. 
def TEXFindnReturn(s, line):    # search f
    m = re.search("(?<!%)" + s, line)  # make sure line is not commented out. 
    if m is not None:
        n = re.search("{(.*)}|{(.*)", line[m.end():])
        if n is not None:
            return n.group(0)[1:-1]

# List of all procedures found in the construction document. 
ProceduresList = list()

# Grab latest versions from dev and pro directories on svn
devFileName = "/Users/rhenning/MJD-ConDoc_dev.tex"
svnProcess = Popen(["svn",  "export", "https://svn.pnl.gov/svn/MJD-ConDoc/MJD-Manual/dev/MJD-ConDoc.tex", "--username", "henning", "--password", "henning",  devFileName], stdout=PIPE)
svnProcess.wait()
proFileName = "/Users/rhenning/MJD-ConDoc_pro.tex"
svnProcess = Popen(["svn",  "export", "https://svn.pnl.gov/svn/MJD-ConDoc/MJD-Manual/pro/MJD-ConDoc.tex", "--username", "henning", "--password", "henning",  proFileName], stdout=PIPE)
svnProcess.wait()
devFile = open(devFileName, 'r')
devString = devFile.read();
devFile.close()
os.remove(devFileName)
proFile = open(proFileName, 'r')
proString = proFile.read();
proFile.close()
os.remove(proFileName)
inString = "<DEV>\n" + devString + "\n<PRO>\n" + proString
lineList = re.split("\n+", inString)

NewProcedure = MJProcedure("dummy")
currentTask = ""
currentOrigin = ""
for line in lineList:
    m = re.search('\s+%|^%', line)
    if m is None:
        if re.search("<DEV>", line) is not None:
            currentOrigin = "DEV"
        if re.search("<PRO>", line) is not None:
            currentOrigin = "PRO"
        search_string = TEXFindnReturn('task}', line)
        if search_string is not None:
            currentTask = search_string
        search_string = TEXFindnReturn('proceduretitle}', line)
        if search_string is not None:
            NewProcedure.Task = currentTask
            NewProcedure.FileOrigin = currentOrigin
            ProceduresList.append(NewProcedure)
            NewProcedure = MJProcedure(search_string)
        search_string = TEXFindnReturn('procedure}', line) 
        if search_string is not None:
            NewProcedure.Procedure = search_string
        search_string = TEXFindnReturn('primarycontact}', line) 
        if search_string is not None:
            NewProcedure.PrimaryContact = search_string
        search_string = TEXFindnReturn('revision}', line) 
        if search_string is not None:
            NewProcedure.Revision = search_string
        search_string = TEXFindnReturn('status}', line) 
        if search_string is not None:
            NewProcedure.Status = search_string
        search_string = TEXFindnReturn('approvaldate}', line) 
        if search_string is not None:
            NewProcedure.ApprovalDate = search_string

ProceduresList.pop(0)  # Remove intial dummy procedure
ProceduresList.pop(0)  # Remove template
print 'Processed ' + str(len(ProceduresList)) + ' procedures'
sortedProceduresList = sorted(ProceduresList, key = attrgetter("Revision"))
sortedProceduresList = sorted(sortedProceduresList, key = attrgetter("Procedure")) 
sortedProceduresList = sorted(sortedProceduresList, key = attrgetter("Task")) 

headerText = "<html>\n\
<body>\n\
<h1> MAJORANA Procedures Status </h1>\n\
<h2> Last Update: " + time.strftime("%d %b %Y %H:%M:%S ET") + "</h2>\n"

tableHeader = "<table border=2 cellspacing=0 cellpadding=4>\n\
<tr> \n\
<td> <h3> Title </h3> </td>\n\
<td> <h3> Task </h3> </td>\n\
<td> <h3> Procedure </h3> </td>\n\
<td> <h3> Primary Contact </h3> </td>\n\
<td> <h3> Revision </h3> </td>\n\
<td> <h3> Status </h3> </td>\n\
<td> <h3> Approval Date </h3> </td>\n\
</tr>\n "

table1 = "<h2> Procedures from /dev and Approved Procedures from /pro </h2>\n" + tableHeader
for myproc in sortedProceduresList:
    if re.search("DEV", myproc.FileOrigin) is not None or (re.search("PRO", myproc.FileOrigin) is not None and re.search("Approved", myproc.Status) is not None):
        table1 += "<tr>\n"
        table1 += "<td>" + myproc.ProcedureTitle + "</td>\n"
        table1 += "<td>" + myproc.Task + "</td>\n"
        table1 += "<td>" + myproc.Procedure + "</td>\n"
        table1 += "<td>" + myproc.PrimaryContact + "</td>\n"
        table1 += "<td>" + myproc.Revision + "</td>\n"
        table1 += "<td>" + myproc.Status + "</td>\n"
        table1 += "<td>" + myproc.ApprovalDate + "</td>\n"
        table1 += "</tr>"
table1 += "</table>\n "

table2 = "<h2> Approved Procedures from /pro </h2>\n" + tableHeader
for myproc in sortedProceduresList:
    if re.search("PRO", myproc.FileOrigin) is not None and re.search("Approved", myproc.Status) is not None:
        table2 += "<tr>\n"
        table2 += "<td>" + myproc.ProcedureTitle + "</td>\n"
        table2 += "<td>" + myproc.Task + "</td>\n"
        table2 += "<td>" + myproc.Procedure + "</td>\n"
        table2 += "<td>" + myproc.PrimaryContact + "</td>\n"
        table2 += "<td>" + myproc.Revision + "</td>\n"
        table2 += "<td>" + myproc.Status + "</td>\n"
        table2 += "<td>" + myproc.ApprovalDate + "</td>\n"
        table2 += "</tr>"
table2 += "</table>\n "

sortedProceduresList = sorted(sortedProceduresList, key = attrgetter("ApprovalDate"))
 
table3 = "<h2> Upcoming Procedures from /dev </h2>\n" + tableHeader
for myproc in sortedProceduresList:
    if re.search("DEV", myproc.FileOrigin) is not None and re.search("Target", myproc.ApprovalDate) is not None:
        table3 += "<tr>\n"
        table3 += "<td>" + myproc.ProcedureTitle + "</td>\n"
        table3 += "<td>" + myproc.Task + "</td>\n"
        table3 += "<td>" + myproc.Procedure + "</td>\n"
        table3 += "<td>" + myproc.PrimaryContact + "</td>\n"
        table3 += "<td>" + myproc.Revision + "</td>\n"
        table3 += "<td>" + myproc.Status + "</td>\n"
        table3 += "<td>" + myproc.ApprovalDate + "</td>\n"
        table3 += "</tr>"
table3 += "</table>\n "

footerText =  "</body>\n </html>\n "

outText = headerText + table2 + table3 + table1 + footerText
outFile = open("/Users/markhowe/Sites/ConDocStatus.html", "w")
outFile.write(outText)
outFile.close()


    







